# 🚀 GitHub Actions Auto Deploy

## 📋 Setup Instructions

### 1. **Cấu hình GitHub Secrets**

Vào **Settings** → **Secrets and variables** → **Actions** và thêm:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `SERVER_HOST` | IP hoặc domain server | `192.168.1.100` hoặc `yourdomain.com` |
| `SERVER_USER` | Username SSH | `root` hoặc `ubuntu` |
| `SERVER_SSH_KEY` | Private SSH key | Nội dung file `~/.ssh/id_rsa` |
| `SERVER_PORT` | SSH port (optional) | `22` (default) |

### 2. **Tạo SSH Key (nếu chưa có)**

```bash
# Trên máy local
ssh-keygen -t rsa -b 4096 -C "github-actions"

# Copy public key lên server
ssh-copy-id user@your-server

# Copy private key content vào GitHub Secret
cat ~/.ssh/id_rsa
```

### 3. **Cấu hình Server**

```bash
# Tạo thư mục app
sudo mkdir -p /var/www/your-app
cd /var/www/your-app

# Clone repository
git clone https://github.com/username/repo-name.git .

# Cấu hình systemd service (nếu cần)
sudo nano /etc/systemd/system/your-app.service
```

### 4. **Test Workflow**

1. **Push code lên GitHub**
2. **Vào tab Actions** để xem tiến trình
3. **Kiểm tra deploy trên server**

## 🔧 Workflow Features

- ✅ **Build Frontend** với Yarn
- ✅ **Build Backend** với .NET 8
- ✅ **Run Tests** trước khi deploy
- ✅ **Auto Deploy** khi push vào main branch
- ✅ **Backup** phiên bản cũ trước khi deploy
- ✅ **Restart Service** sau deploy

## 📝 Notes

- Workflow chỉ deploy khi push vào `main` branch
- Pull Request sẽ chỉ build và test, không deploy
- Server cần có Git, .NET Runtime và systemd service
- Backup tự động được tạo với timestamp

## 🔍 Troubleshooting

### Lỗi SSH:
```bash
# Kiểm tra SSH key
ssh -i ~/.ssh/id_rsa user@server

# Kiểm tra permissions
chmod 600 ~/.ssh/id_rsa
chmod 644 ~/.ssh/id_rsa.pub
```

### Lỗi Deploy:
- Kiểm tra logs trong GitHub Actions
- SSH vào server kiểm tra service status
- Xem logs application: `journalctl -u your-app -f`
