export const formatDateToFrench = (dateString) => {
    if (!dateString) return '';

    try {
        const date = new Date(dateString);

        // Format to French locale with Paris timezone
        return new Intl.DateTimeFormat('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: 'Europe/Paris'
        }).format(date);

        // Alternative manual formatting if needed:
        // const options = { timeZone: 'Europe/Paris' };
        // const frenchDate = new Date(date.toLocaleString('en-US', options));
        // return `${String(frenchDate.getDate()).padStart(2, '0')}/${String(frenchDate.getMonth() + 1).padStart(2, '0')}/${frenchDate.getFullYear()} ${String(frenchDate.getHours()).padStart(2, '0')}:${String(frenchDate.getMinutes()).padStart(2, '0')}:${String(frenchDate.getSeconds()).padStart(2, '0')}`;
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString; // Return original string if parsing fails
    }
};

// Function to decode HTML entities
export const decodeHtmlEntities = (text) => {
    if (!text) return '';

    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
};

export function decodeUnicodeEscapes(str) {
    return str.replace(/\\u([a-fA-F0-9]{4})/g, (match, hex) => 
        String.fromCharCode(parseInt(hex, 16))
    );
}