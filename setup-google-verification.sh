#!/bin/bash

# Скрипт для швидкого налаштування Google Search Console верифікації

echo "🔍 Шукаю файл верифікації Google..."

# Шукаємо файл в Downloads
GOOGLE_FILE=$(find ~/Downloads -name "google*.html" -type f | head -n 1)

if [ -z "$GOOGLE_FILE" ]; then
    echo ""
    echo "❌ ПОМИЛКА: Файл верифікації не знайдено в Downloads!"
    echo ""
    echo "📝 ЩО РОБИТИ:"
    echo "1. Поверніться в браузер (Google Search Console)"
    echo "2. Натисніть на кнопку ⬇️ googledb3caee2df37ac56.html"
    echo "3. Почекайте поки файл завантажиться"
    echo "4. Запустіть цей скрипт знову: ./setup-google-verification.sh"
    echo ""
    exit 1
fi

echo "✅ Знайдено файл: $(basename "$GOOGLE_FILE")"

# Копіюємо файл в папку public
PUBLIC_DIR="/Users/volodymyrkrutskyi/Desktop/fakrury/faktury/public"
cp "$GOOGLE_FILE" "$PUBLIC_DIR/"

if [ $? -eq 0 ]; then
    echo "✅ Файл успішно скопійовано в папку public/"
    
    FILENAME=$(basename "$GOOGLE_FILE")
    
    echo ""
    echo "🎉 ГОТОВО! Тепер:"
    echo ""
    echo "1. Поверніться в браузер (Google Search Console)"
    echo "2. Натисніть кнопку VERIFY"
    echo "3. Google перевірить файл на: https://www.faktix.cz/$FILENAME"
    echo ""
    echo "⚠️ ВАЖЛИВО: Переконайтесь, що ваш сайт запущений!"
    echo "   Якщо потрібно, запустіть: npm run dev"
    echo ""
    
    # Перевіряємо чи сайт запущений
    if curl -s "http://localhost:3000/$FILENAME" > /dev/null 2>&1; then
        echo "✅ Сайт запущений і файл доступний!"
        echo "   Перевірити: http://localhost:3000/$FILENAME"
    else
        echo "⚠️ Сайт НЕ запущений на localhost:3000"
        echo "   Запустіть: cd /Users/volodymyrkrutskyi/Desktop/fakrury/faktury && npm run dev"
    fi
    
else
    echo "❌ Помилка при копіюванні файлу!"
    exit 1
fi


