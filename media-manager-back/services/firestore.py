from google.cloud import firestore
from typing import Dict, List, Any, Optional, Union


class FirestoreService:
    """Service class to handle Firestore operations."""

    def __init__(self):
        """Initialize Firestore client."""
        self.db = firestore.Client(
            database="media-manager"
        )

    def create_document(self, collection_name: str, data: Dict[str, Any], document_id: Optional[str] = None) -> str:
        """
        Create a new document in Firestore.
        
        Args:
            collection_name: Name of the collection
            data: Dictionary containing document data
            document_id: Optional document ID. If not provided, Firestore will generate one
            
        Returns:
            The ID of the created document
        """
        collection_ref = self.db.collection(collection_name)

        if document_id:
            doc_ref = collection_ref.document(document_id)
            doc_ref.set(data)
            return document_id
        else:
            doc_ref = collection_ref.add(data)[1]
            return doc_ref.id

    def get_document(self, collection_name: str, document_id: str) -> Optional[Dict[str, Any]]:
        """
        Retrieve a document from Firestore by ID.
        
        Args:
            collection_name: Name of the collection
            document_id: ID of the document to retrieve
            
        Returns:
            Document data as dictionary or None if document doesn't exist
        """
        doc_ref = self.db.collection(collection_name).document(document_id)
        doc = doc_ref.get()
        
        if doc.exists:
            return doc.to_dict()
        return None

    def update_document(self, collection_name: str, document_id: str, data: Dict[str, Any], merge: bool = True) -> bool:
        """
        Update an existing document in Firestore.
        
        Args:
            collection_name: Name of the collection
            document_id: ID of the document to update
            data: Dictionary containing updated fields
            merge: If True, performs a merge update instead of overwriting the entire document
            
        Returns:
            True if update was successful, False otherwise
        """
        try:
            doc_ref = self.db.collection(collection_name).document(document_id)
            doc_ref.set(data, merge=merge)
            return True
        except Exception:
            return False

    def delete_document(self, collection_name: str, document_id: str) -> bool:
        """
        Delete a document from Firestore.
        
        Args:
            collection_name: Name of the collection
            document_id: ID of the document to delete
            
        Returns:
            True if deletion was successful, False otherwise
        """
        try:
            self.db.collection(collection_name).document(document_id).delete()
            return True
        except Exception:
            return False

    def query_documents(self, collection_name: str, filters: Optional[List[tuple]] = None, 
                        order_by: Optional[Union[str, tuple]] = None, limit: Optional[int] = None) -> List[Dict[str, Any]]:
        """
        Query documents from a collection with optional filtering, ordering and limiting.
        
        Args:
            collection_name: Name of the collection
            filters: List of filter tuples in format (field, operator, value)
                     e.g. [('name', '==', 'John'), ('age', '>', 18)]
            order_by: Field to order by, or tuple (field, direction) where direction is 'ASCENDING' or 'DESCENDING'
            limit: Maximum number of documents to return
            
        Returns:
            List of document dictionaries matching the query
        """
        query = self.db.collection(collection_name)
        
        # Apply filters if provided
        if filters:
            for field, op, value in filters:
                query = query.where(field, op, value)
        
        # Apply ordering if provided
        if order_by:
            if isinstance(order_by, tuple):
                field, direction = order_by
                direction_obj = firestore.Query.ASCENDING if direction == 'ASCENDING' else firestore.Query.DESCENDING
                query = query.order_by(field, direction=direction_obj)
            else:
                query = query.order_by(order_by)
        
        # Apply limit if provided
        if limit:
            query = query.limit(limit)
        
        # Execute query and return results
        results = []
        for doc in query.stream():
            doc_dict = doc.to_dict()
            doc_dict['id'] = doc.id  # Include document ID in the result
            results.append(doc_dict)
        
        return results

    def collection_group_query(self, collection_id: str, filters: Optional[List[tuple]] = None) -> List[Dict[str, Any]]:
        """
        Query across all collections with the given ID, regardless of path.
        Useful for querying subcollections with the same name.
        
        Args:
            collection_id: Collection ID to query
            filters: List of filter tuples in format (field, operator, value)
            
        Returns:
            List of document dictionaries matching the query
        """
        query = self.db.collection_group(collection_id)
        
        # Apply filters if provided
        if filters:
            for field, op, value in filters:
                query = query.where(field, op, value)
        
        # Execute query and return results
        results = []
        for doc in query.stream():
            doc_dict = doc.to_dict()
            doc_dict['id'] = doc.id
            doc_dict['path'] = doc.reference.path
            results.append(doc_dict)
        
        return results

    def batch_write(self, operations: List[Dict[str, Any]]) -> bool:
        """
        Perform multiple write operations in a single atomic batch.
        
        Args:
            operations: List of operation dictionaries with keys:
                - 'type': One of 'create', 'update', or 'delete'
                - 'collection': Collection name
                - 'document_id': Document ID
                - 'data': Document data (for create/update operations)
                - 'merge': Boolean for merge update (for update operations)
                
        Returns:
            True if batch operation was successful, False otherwise
        """
        batch = self.db.batch()
        
        try:
            for op in operations:
                op_type = op['type']
                collection = op['collection']
                doc_id = op['document_id']
                doc_ref = self.db.collection(collection).document(doc_id)
                
                if op_type == 'create':
                    batch.set(doc_ref, op['data'])
                elif op_type == 'update':
                    merge = op.get('merge', True)
                    batch.set(doc_ref, op['data'], merge=merge)
                elif op_type == 'delete':
                    batch.delete(doc_ref)
                else:
                    raise ValueError(f"Unknown operation type: {op_type}")
            
            batch.commit()
            return True
        except Exception:
            return False
