function sendMessage() {
    const input = document.getElementById('userInput');
    const message = input.value.trim();
    if (!message) return;

    const messages = document.getElementById('messages');

    const userMessage = `<div><b>You:</b> ${message}</div>`;
    messages.innerHTML += userMessage;
    input.value = ''; 

    fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
    })
    .then(res => res.json())
    .then(data => {
        const botMessage = `<div><b>Bot:</b> ${data.reply}</div>`;
        messages.innerHTML += botMessage;
        messages.scrollTop = messages.scrollHeight;
    });
}

window.onload = () => {
    fetch('/history')
    .then(res => res.json())
    .then(chats => {
        const messages = document.getElementById('messages');
        messages.innerHTML = ''; 
        
        chats.reverse().forEach(chat => {
            const userMessage = `<div><b>You:</b> ${chat.userMessage}</div>`;
            const botMessage = `<div><b>Bot:</b> ${chat.botResponse}</div>`;
            messages.innerHTML += userMessage + botMessage;
        });
    });
};

function viewHistory() {
    // Fetch the history and open it in a new window
    fetch('/history')
    .then(res => res.json())
    .then(data => {
        // Open a new window
        const historyWindow = window.open('', 'Chat History', 'width=600,height=400');
        historyWindow.document.write('<html><head><title>Chat History</title></head><body>');
        historyWindow.document.write('<h2>Chat History</h2>');

        if (data.length === 0) {
            historyWindow.document.write('<p>No chat history available.</p>');
        } else {
            data.forEach(chat => {
                historyWindow.document.write(`<div><b>You:</b> ${chat.userMessage}</div>`);
                historyWindow.document.write(`<div><b>Bot:</b> ${chat.botResponse}</div><hr>`);
            });
        }

        historyWindow.document.write('</body></html>');
        historyWindow.document.close();
    })
    .catch(error => {
        console.error('Error fetching chat history:', error);
        alert('Error fetching chat history.');
    });
}

function deleteChatHistory() {
    if (confirm('Are you sure you want to delete all chat history?')) {
        fetch('/delete-history', {
            method: 'DELETE',
        })
        .then(res => res.json())
        .then(() => {
            alert('Chat history deleted successfully!');
            
            document.getElementById('messages').innerHTML = ''; 
        })
        .catch(error => {
            console.error('Error deleting chat history:', error);
            alert('Error deleting chat history.');
        });
    }
}
