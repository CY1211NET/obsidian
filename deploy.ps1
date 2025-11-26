# 自动部署脚本
# 运行方式: .\deploy.ps1
$ErrorActionPreference = 'Stop'

# 1. 构建项目
Write-Host "正在构建项目..."
npm run build

# 2. 进入构建目录
Write-Host "正在添加 .nojekyll 文件..."
New-Item -ItemType File -Path "out\.nojekyll" -Force

cd out

# 3. 初始化 Git 并提交
Write-Host "正在准备发布..."
git init
git checkout -b gh-pages
git add -A
git commit -m "Deploy to GitHub Pages"

# 4. 推送到 GitHub
Write-Host "正在推送到 GitHub..."
# 注意：这里假设你已经有权限推送
git remote add origin https://github.com/CY1211NET/obsidian.git
git push -f origin gh-pages

# 5. 返回根目录
cd ..

Write-Host "发布完成！请访问 GitHub Pages 查看更新。"
