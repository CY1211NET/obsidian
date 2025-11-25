---
title: GIT远程网络问题推送失败问题解决
date: '2025-04-08'
category: GIT
tags:
- GIT
draft: false
author: Crain
---
## 网络问题解决

---

### **1. 错误原因分析**
错误信息：
```
fatal: unable to access 'https://github.com/Trileaf-MC/trileaf-monitor.git/': Recv failure: Connection was reset
```
表明 Git 无法连接到 GitHub 的远程仓库，可能的原因包括：
- **网络问题**：本地网络不稳定或被防火墙拦截。
- **代理配置**：Git 配置了错误的 HTTP/HTTPS 代理。
- **认证失败**：凭据（如密码或 Token）无效。

---

### **2. 逐步解决方案**

#### **步骤 1：检查网络连接**
1. 确认你的网络可以正常访问 GitHub：
   ```bash
   ping github.com
   ```
   - 如果超时，可能是网络问题，尝试切换网络（如手机热点）。

2. 测试 HTTPS 连接：
   ```bash
   curl -v https://github.com
   ```
   - 如果返回 `Connection reset`，可能是防火墙或代理问题。

#### **步骤 2：检查 Git 远程地址**
确保远程仓库地址正确：
```bash
git remote -v
```
- 如果地址是 `https://github.com/...`，尝试改用 SSH 协议（需配置 SSH 密钥）：
  ```bash
  git remote set-url origin git@github.com:Trileaf-MC/trileaf-monitor.git
  ```

#### **步骤 3：检查代理设置**
1. 查看当前 Git 代理配置：
   ```bash
   git config --global --get http.proxy
   git config --global --get https.proxy
   ```
2. 如果存在代理但不可用，清除代理：
   ```bash
   git config --global --unset http.proxy
   git config --global --unset https.proxy
   ```

#### **步骤 4：重试推送**
```bash
git push
```
- 如果仍失败，尝试强制使用 SSH：
  ```bash
  GIT_SSH_COMMAND="ssh -v" git push
  ```
  - `-v` 参数会输出详细调试信息，帮助定位问题。

#### **步骤 5：检查认证**
1. 如果使用 HTTPS，确保凭据正确：
   - GitHub 已不再支持密码推送，需使用 **Personal Access Token (PAT)**。
   - 生成 PAT：`Settings > Developer settings > Personal access tokens`。
2. 更新 Git 凭据存储：
   ```bash
   git config --global credential.helper store
   git push
   ```
   - 首次推送会提示输入用户名和 Token。

---

### **3. 备用方案**
如果问题持续，尝试以下方法：
#### **方法 1：使用 SSH 协议（推荐）**
1. 生成 SSH 密钥并添加到 GitHub：
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   cat ~/.ssh/id_ed25519.pub
   ```
   - 将公钥粘贴到 `Settings > SSH and GPG keys`。
2. 更新远程地址为 SSH：
   ```bash
   git remote set-url origin git@github.com:Trileaf-MC/trileaf-monitor.git
   git push
   ```

#### **方法 2：使用 GitHub CLI**
安装 [GitHub CLI](https://cli.github.com/) 后尝试：
```bash
gh auth login  # 按提示登录
git push
```

---

### **4. 验证成功**
推送成功后，检查远程分支状态：
```bash
git log --oneline origin/CY-mod-test-1.20.1  # 查看远程分支提交
```

---

### **常见问题总结**
| 问题 | 解决命令 |
|------|----------|
| 网络不通 | `ping github.com`，切换网络 |
| HTTPS 连接被重置 | 改用 SSH：`git remote set-url origin git@github.com:...` |
| 代理配置错误 | `git config --global --unset http.proxy` |
| 认证失败 | 生成 PAT 或配置 SSH 密钥 |

如果仍有问题，请提供 `git push -v` 的完整输出以便进一步诊断！