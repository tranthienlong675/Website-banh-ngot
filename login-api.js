document.getElementById('loginForm').addEventListener('submit', function(event) {
    // Ngăn chặn hành vi gửi biểu mẫu mặc định
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const messageElement = document.getElementById('message');
    const loginButton = this.querySelector('button[type="submit"]');

    // Thiết lập lại thông báo và vô hiệu hóa nút
    messageElement.className = 'message';
    messageElement.textContent = 'Đang đăng nhập...';
    messageElement.classList.add('info'); // Thêm class info nếu bạn muốn kiểu dáng riêng cho trạng thái chờ
    loginButton.disabled = true; // Vô hiệu hóa nút để tránh gửi nhiều lần

    // Gửi yêu cầu đăng nhập đến API
    authenticateUser(username, password)
        .then(data => {
            // Xử lý phản hồi từ API
            if (data && data.success === true) { // Giả định API trả về success: true/false
                messageElement.textContent = 'Đăng nhập thành công! Chào mừng.';
                messageElement.classList.remove('info');
                messageElement.classList.add('success');
                // Thực hiện chuyển hướng (ví dụ)
                // window.location.href = '/dashboard.html'; 
            } else if (data && data.message) {
                // Xử lý thông báo lỗi cụ thể từ API
                messageElement.textContent = 'Lỗi: ' + data.message;
                messageElement.classList.remove('info');
                messageElement.classList.add('error');
            } else {
                // Lỗi xác thực chung
                messageElement.textContent = 'Lỗi: Tên người dùng hoặc mật khẩu không hợp lệ.';
                messageElement.classList.remove('info');
                messageElement.classList.add('error');
            }
        })
        .catch(error => {
            // Xử lý lỗi mạng hoặc lỗi hệ thống khác
            messageElement.textContent = 'Lỗi kết nối. Vui lòng kiểm tra địa chỉ API hoặc mạng.';
            messageElement.classList.remove('info');
            messageElement.classList.add('error');
            console.error('Lỗi khi gọi API:', error);
        })
        .finally(() => {
            // Luôn bật lại nút sau khi yêu cầu hoàn tất
            loginButton.disabled = false;
        });
});

/**
 * Gửi yêu cầu POST đến API đăng nhập.
 * @param {string} user - Tên người dùng.
 * @param {string} pass - Mật khẩu.
 * @returns {Promise<Object>} - Promise trả về dữ liệu phản hồi JSON từ API.
 */
function authenticateUser(user, pass) {
    const API_URL = 'https://banhngot.fitlhu.com/api/auth/login';
    
    // Tạo chuỗi dữ liệu theo cấu trúc API yêu cầu: {username*[...]password*[...]}
    // Lưu ý: Cấu trúc này không phải là JSON chuẩn mà là một chuỗi đặc biệt.
    const requestBody = `{username*${user}password*${pass}}`;

    return fetch(API_URL, {
        method: 'POST',
        // Vì đây không phải là JSON chuẩn, chúng ta sẽ đặt Content-Type là text/plain hoặc bỏ qua
        // Tuy nhiên, nếu API của bạn mong đợi JSON, cần thay đổi cách tạo requestBody
        // Giả sử nó mong đợi văn bản thuần túy hoặc cấu trúc đặc biệt:
        // headers: {
        //     'Content-Type': 'text/plain' 
        // },
        body: requestBody // Gửi chuỗi đặc biệt
    })
    .then(response => {
        // Kiểm tra xem phản hồi có thành công về mặt HTTP không (200-299)
        if (!response.ok) {
             // Ném lỗi nếu HTTP status code không thành công (ví dụ: 401, 404, 500)
             // Lưu ý: Đôi khi API trả về 200 OK ngay cả khi đăng nhập thất bại.
             // Nếu phản hồi là lỗi HTTP, ta có thể ném lỗi hoặc tiếp tục đọc JSON.
             // Ở đây, ta tiếp tục đọc JSON để xử lý lỗi từ body.
        }
        return response.json(); // Phân tích phản hồi JSON
    });
}