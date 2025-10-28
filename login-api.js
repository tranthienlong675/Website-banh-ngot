document.getElementById('loginForm').addEventListener('submit', function(event) {
    // Ngăn chặn hành vi gửi biểu mẫu mặc định
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const messageElement = document.getElementById('message');
    const loginButton = this.querySelector('button[type="submit"]');

    // Thiết lập trạng thái chờ
    messageElement.className = 'message';
    messageElement.textContent = 'Đang đăng nhập...';
    messageElement.classList.add('info'); 
    loginButton.disabled = true;

    // Gửi yêu cầu đăng nhập đến API
    authenticateUser(username, password)
        .then(data => {
            // Xử lý phản hồi từ API
            if (data && data.success === true) { 
                // TRƯỜNG HỢP 1: Đăng nhập thành công (success: true)
                messageElement.textContent = 'Đăng nhập thành công! Đang chuyển hướng...'; 
                messageElement.classList.remove('info');
                messageElement.classList.add('success');
                
                // Lưu token hoặc dữ liệu người dùng vào localStorage/sessionStorage nếu cần
                // Ví dụ: localStorage.setItem('token', data.data.token);
                
                // Tự động chuyển hướng về trang chủ (index.html) sau 1.5 giây
                setTimeout(() => {
                    window.location.href = 'index.html'; 
                }, 1500);
                
            } else if (data && data.success === false) {
                // TRƯỜNG HỢP 2: Lỗi xác thực (success: false)
                // Phản hồi lỗi có thể là 401 hoặc 200, nhưng body chứa success: false
                const errorMessage = data.message || data.error || 'Tên người dùng hoặc mật khẩu không đúng.';
                messageElement.textContent = 'Lỗi: ' + errorMessage;
                messageElement.classList.remove('info');
                messageElement.classList.add('error');
            } else {
                // Phản hồi không có cấu trúc mong đợi
                messageElement.textContent = 'Lỗi: Phản hồi API không hợp lệ.';
                messageElement.classList.remove('info');
                messageElement.classList.add('error');
            }
        })
        .catch(error => {
            // TRƯỜNG HỢP 3: Lỗi mạng hoặc lỗi hệ thống khác
            messageElement.textContent = 'Lỗi kết nối. Vui lòng kiểm tra địa chỉ API hoặc mạng.';
            messageElement.classList.remove('info');
            messageElement.classList.add('error');
            console.error('Lỗi khi gọi API:', error);
        })
        .finally(() => {
            // Bật lại nút nếu không phải trạng thái thành công (đang chờ chuyển hướng)
            if (!(messageElement.classList.contains('success'))) {
                loginButton.disabled = false;
            }
        });
});

/**
 * Gửi yêu cầu POST đến API đăng nhập với định dạng JSON chuẩn.
 * @param {string} user - Tên người dùng.
 * @param {string} pass - Mật khẩu.
 * @returns {Promise<Object>} - Promise trả về dữ liệu phản hồi JSON từ API.
 */
function authenticateUser(user, pass) {
    const API_URL = 'https://banhngot.fitlhu.com/api/auth/login';
    
    // ĐIỀU CHỈNH QUAN TRỌNG: Dữ liệu gửi đi là JSON chuẩn
    const requestData = {
        username: user,
        password: pass
    };

    return fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Báo cho server biết chúng ta đang gửi JSON
        },
        body: JSON.stringify(requestData) // Chuyển đổi đối tượng JS thành chuỗi JSON
    })
    .then(response => {
        // API có thể trả về status 401/500 nhưng body vẫn là JSON
        // Ta không ném lỗi ở đây để có thể đọc body JSON trong block .then
        return response.json(); 
    });
}