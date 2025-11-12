#!/bin/bash

echo "🚀 Faktix Platform - Quick Deploy Script"
echo "=========================================="

# Перевірка, чи ми в правильній директорії
if [ ! -f "package.json" ]; then
    echo "❌ Помилка: package.json не знайдено"
    echo "Переконайтеся, що ви в директорії /Users/volodymyrkrutskyi/Desktop/fakrury/faktury"
    exit 1
fi

echo "✅ Знайдено package.json"

# Збірка проекту
echo "🔨 Збірка проекту..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Проект успішно зібрано!"
else
    echo "❌ Помилка збірки"
    exit 1
fi

# Ініціалізація Git (якщо ще не зроблено)
if [ ! -d ".git" ]; then
    echo "📦 Ініціалізація Git..."
    git init
    git add .
    git commit -m "🚀 Faktix Platform - Initial commit"
    echo "✅ Git ініціалізовано"
else
    echo "📦 Оновлення Git..."
    git add .
    git commit -m "🚀 Faktix Platform - Update"
    echo "✅ Git оновлено"
fi

echo ""
echo "🎯 Наступні кроки для публікації:"
echo "=================================="
echo ""
echo "1. Створіть репозиторій на GitHub:"
echo "   https://github.com/new"
echo "   Назва: faktix-platform"
echo ""
echo "2. Додайте віддалений репозиторій:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/faktix-platform.git"
echo ""
echo "3. Завантажте код:"
echo "   git push -u origin main"
echo ""
echo "4. Публікація на Vercel:"
echo "   https://vercel.com/"
echo "   - Sign Up (через GitHub)"
echo "   - New Project"
echo "   - Виберіть faktix-platform"
echo "   - Deploy"
echo ""
echo "5. Налаштуйте змінні середовища в Vercel Dashboard"
echo ""
echo "🌐 Ваш сайт буде доступний за адресою:"
echo "   https://faktix-platform.vercel.app"
echo ""
echo "✅ Готово! Проект готовий до публікації!"









