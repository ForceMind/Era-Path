@echo off
echo 正在部署时代之路到GitHub...

:: 检查是否在正确的目录
if not exist "index.html" (
    echo 错误：请在项目根目录运行此脚本
    pause
    exit /b 1
)

:: 添加所有文件
git add .

:: 询问提交信息
set /p commit_msg="请输入提交信息（直接回车使用默认信息）: "
if "%commit_msg%"=="" set commit_msg=Update game files

:: 提交更改
git commit -m "%commit_msg%"

:: 推送到GitHub
git push

echo.
echo 部署完成！
echo 游戏地址: https://forcemind.github.io/Era-Path/
echo.
pause
