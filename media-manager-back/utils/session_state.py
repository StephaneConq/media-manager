import streamlit as st

def initialize_session_state():
    """Initialize session state variables if they don't exist"""
    if "loading" not in st.session_state:
        st.session_state.loading = False
    if "page" not in st.session_state:
        st.session_state.page = "home"
    if "current_channel" not in st.session_state:
        st.session_state.current_channel = None
        
