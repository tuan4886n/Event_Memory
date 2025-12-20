# Sử dụng image Jenkins LTS làm nền
FROM jenkins/jenkins:lts

# Chuyển sang user root để cài đặt các công cụ cần thiết
USER root

# Cài đặt sudo và các công cụ cần thiết
RUN apt-get update && \
    apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release && \
    curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg && \
    echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] \
    https://download.docker.com/linux/debian $(lsb_release -cs) stable" \
    > /etc/apt/sources.list.d/docker.list && \
    apt-get update && \
    apt-get install -y docker-ce-cli && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Cài đặt Docker Compose
# Tải phiên bản mới nhất từ GitHub và đặt vào thư mục /usr/local/bin
RUN curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose && \
    chmod +x /usr/local/bin/docker-compose

# Thêm người dùng jenkins vào nhóm docker để có quyền truy cập
RUN groupadd -f docker && usermod -aG docker jenkins

# Cài đặt các plugin bằng CLI chính thức.
# Bao gồm cả các plugin bị lỗi và các plugin thường dùng.
RUN jenkins-plugin-cli --plugins \
    docker-workflow \
    authentication-tokens \
    docker-commons \
    matrix-auth \
    pipeline-github-lib \
    credentials \
    plain-credentials \
    ssh-credentials \
    git \
    git-client \
    workflow-basic-steps

# cài đăt kubectl
RUN curl -LO "https://dl.k8s.io/release/$(curl -LS https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl" && \
    chmod +x kubectl && \
    mv kubectl /usr/local/bin/

# Trở lại user jenkins mặc định
USER jenkins