//https://banhngot.fitlhu.com/api/auth/register
document.getElementById('registerForm').addEventListener('submit', function(event) {
    // Ngăn chặn hành vi gửi biểu mẫu mặc định
    event.preventDefault();

    // Thu thập dữ liệu từ các trường nhập liệu
    const username = document.getElementById('reg_username').value;
    const email = document.getElementById('reg_email').value;
    const password = document.getElementById('reg_password').value;
    const full_name = document.getElementById('reg_full_name').value;
    // Lấy giá trị hoặc dùng mặc định nếu để trống
    const avatar = document.getElementById('reg_avatar').value || "https://example.com/default-avatar.jpg"; 

    const messageElement = document.getElementById('message');
    const registerButton = this.querySelector('button[type="submit"]');

    // Thiết lập trạng thái chờ
    messageElement.className = 'message info';
    messageElement.textContent = 'Đang tiến hành đăng ký...';
    registerButton.disabled = true;

    // Chuẩn bị dữ liệu gửi đi (JSON)
    const registrationData = {
        username: username,
        email: email,
        password: password,
        full_name: full_name,
        avatar: avatar
    };

    // Gọi API Đăng Ký
    registerUser(registrationData)
        .then(data => {
            if (data && data.success === true) { 
                // TRƯỜNG HỢP 1: Đăng ký thành công (success: true)
                messageElement.textContent = 'Đăng ký thành công! Đang chuyển hướng...';
                messageElement.classList.remove('info');
                messageElement.classList.add('success');
                
                // Chuyển hướng người dùng đến trang đăng nhập sau 3 giây
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 3000);
                
            } else if (data && data.success === false) {
                // TRƯỜNG HỢP 2: Lỗi API (Validation hoặc Server) - success: false
                // Ưu tiên hiển thị thông báo lỗi chi tiết nhất từ API
                const errorMessage = data.error || data.message || 'Lỗi đăng ký không xác định.';
                messageElement.textContent = 'Lỗi Đăng Ký: ' + errorMessage;
                messageElement.classList.remove('info');
                messageElement.classList.add('error');
            } else {
                // Lỗi phản hồi không mong đợi
                messageElement.textContent = 'Đã xảy ra lỗi không xác định khi đăng ký.';
                messageElement.classList.remove('info');
                messageElement.classList.add('error');
            }
        })
        .catch(error => {
            // Xử lý lỗi mạng/kết nối
            messageElement.textContent = 'Lỗi kết nối. Vui lòng thử lại sau.';
            messageElement.classList.remove('info');
            messageElement.classList.add('error');
            console.error('Lỗi khi gọi API Đăng Ký:', error);
        })
        .finally(() => {
            // Bật lại nút nếu KHÔNG phải trạng thái thành công
            if (!(messageElement.classList.contains('success'))) {
                registerButton.disabled = false;
            }
        });
});

/**
 * Gửi yêu cầu POST để đăng ký người dùng mới.
 * @param {Object} data - Dữ liệu đăng ký (username, email, password, full_name, avatar).
 * @returns {Promise<Object>} - Promise trả về dữ liệu phản hồi JSON từ API.
 */
function registerUser(data) {
    const API_URL = 'https://banhngot.fitlhu.com/api/auth/register';
    
    return fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(data) // Chuyển đổi đối tượng JS thành chuỗi JSON
    })
    .then(response => {
        // API có thể trả về status 400/500 nhưng body vẫn là JSON chứa thông báo lỗi.
        // Ta không ném lỗi ở đây mà để block .then xử lý body JSON.
        return response.json(); 
    });
}