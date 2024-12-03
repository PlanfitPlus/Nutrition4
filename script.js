function calculateCalories() {
    // الحصول على قيم المدخلات
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const age = parseInt(document.getElementById('age').value);
    const gender = document.getElementById('gender').value;
    const activity = parseFloat(document.getElementById('activity').value);

    // التحقق من صحة المدخلات
    if (!weight || !height || !age || !activity) {
        showError('الرجاء إدخال جميع البيانات المطلوبة');
        return;
    }

    // التحقق من صحة القيم
    if (weight < 30 || weight > 250) {
        showError('الرجاء إدخال وزن صحيح (30-250 كجم)');
        return;
    }
    if (height < 120 || height > 220) {
        showError('الرجاء إدخال طول صحيح (120-220 سم)');
        return;
    }
    if (age < 15 || age > 80) {
        showError('الرجاء إدخال عمر صحيح (15-80 سنة)');
        return;
    }

    // حساب معدل الأيض الأساسي (BMR) باستخدام معادلة Mifflin-St Jeor
    let bmr;
    if (gender === 'male') {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }

    // حساب السعرات الحرارية اليومية المطلوبة
    const tdee = bmr * activity;
    
    // حساب السعرات المطلوبة للتنشيف (خفض 20%)
    const targetCalories = Math.round(tdee * 0.8);

    // عرض النتائج
    displayResults(bmr, tdee, targetCalories);
    
    // تحديث توصيات الوجبات
    updateMealRecommendations(targetCalories);
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    // إضافة الرسالة إلى النموذج
    const form = document.querySelector('.user-info');
    const existingError = form.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    form.insertBefore(errorDiv, form.firstChild);
    
    // إخفاء الرسالة بعد 3 ثواني
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

function displayResults(bmr, tdee, targetCalories) {
    const resultsDiv = document.createElement('div');
    resultsDiv.className = 'calories-results';
    
    // إضافة تأثير التحميل
    resultsDiv.innerHTML = '<div class="loading-spinner"></div>';
    
    const userInfo = document.querySelector('.user-info');
    const existingResults = userInfo.querySelector('.calories-results');
    if (existingResults) {
        existingResults.remove();
    }
    userInfo.appendChild(resultsDiv);

    // محاكاة وقت المعالجة
    setTimeout(() => {
        resultsDiv.innerHTML = `
            <h3>نتائج حساب السعرات الحرارية</h3>
            <div class="results-grid">
                <div class="result-card">
                    <div class="result-icon"><i class="fas fa-fire"></i></div>
                    <div class="result-label">معدل الأيض الأساسي (BMR)</div>
                    <div class="result-value">${Math.round(bmr)} سعرة حرارية</div>
                </div>
                <div class="result-card">
                    <div class="result-icon"><i class="fas fa-running"></i></div>
                    <div class="result-label">إجمالي الطاقة اليومية (TDEE)</div>
                    <div class="result-value">${Math.round(tdee)} سعرة حرارية</div>
                </div>
                <div class="result-card highlight">
                    <div class="result-icon"><i class="fas fa-bullseye"></i></div>
                    <div class="result-label">السعرات المستهدفة للتنشيف</div>
                    <div class="result-value">${targetCalories} سعرة حرارية</div>
                </div>
            </div>
            <div class="results-tips">
                <h4>توصيات هامة</h4>
                <ul>
                    <li>قم بتوزيع السعرات على 5-6 وجبات يومياً</li>
                    <li>تناول البروتين في كل وجبة (30-35% من السعرات)</li>
                    <li>اشرب الماء بكثرة (8-10 أكواب يومياً)</li>
                    <li>مارس التمارين الرياضية 3-4 مرات أسبوعياً</li>
                </ul>
            </div>
        `;
        
        // تمرير إلى النتائج بتأثير سلس
        resultsDiv.scrollIntoView({ behavior: 'smooth' });
    }, 1000);
}

function updateMealRecommendations(targetCalories) {
    // توزيع السعرات على الوجبات
    const mealDistribution = {
        breakfast: 0.25, // 25% للإفطار
        snack1: 0.15,    // 15% للوجبة الخفيفة الأولى
        lunch: 0.35,     // 35% للغداء
        snack2: 0.10,    // 10% للوجبة الخفيفة الثانية
        dinner: 0.15     // 15% للعشاء
    };

    // تحديث سعرات كل وجبة
    Object.entries(mealDistribution).forEach(([meal, percentage]) => {
        const mealCalories = Math.round(targetCalories * percentage);
        const mealElement = document.getElementById(meal);
        if (mealElement) {
            const caloriesElement = mealElement.querySelector('.meal-calories');
            if (caloriesElement) {
                caloriesElement.textContent = `${mealCalories} سعرة حرارية`;
            }
        }
    });
}

// إضافة تأثيرات للنموذج
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input, select');
    
    inputs.forEach(input => {
        // إضافة تأثير عند التركيز
        input.addEventListener('focus', function() {
            this.closest('.form-group').classList.add('focused');
        });

        input.addEventListener('blur', function() {
            if (!this.value) {
                this.closest('.form-group').classList.remove('focused');
            }
        });

        // التحقق من الإدخال في الوقت الفعلي
        input.addEventListener('input', function() {
            validateInput(this);
        });

        // حساب السعرات عند الضغط على Enter
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calculateCalories();
            }
        });
    });

    // إضافة تأثيرات للأزرار
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });

        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // تحريك السلس للأزرار
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // تحريك البطاقات عند التمرير
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.meal, .cert-card, .plan-card').forEach((el) => {
        observer.observe(el);
    });

    // أزرار الخطط
    document.querySelectorAll('.plan-button').forEach(button => {
        button.addEventListener('click', function() {
            // يمكن إضافة نموذج حجز أو توجيه إلى صفحة الحجز
            alert('سيتم توجيهك إلى صفحة الحجز قريباً');
        });
    });

    // تأثيرات حركية للأيقونات
    document.querySelectorAll('.cert-card i, .social-icons a').forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.2)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // تحريك عند التمرير
    const observer2 = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.meal').forEach((meal) => {
        observer2.observe(meal);
        
        // إضافة تأثير عند التحويم
        meal.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
        });
        
        meal.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        });
    });

    // تأثيرات للأيقونات
    document.querySelectorAll('.meal-icon').forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'rotate(360deg) scale(1.1)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'rotate(0) scale(1)';
        });
    });

    // تأثير نبض للسعرات الحرارية
    document.querySelectorAll('.calories').forEach(calorie => {
        calorie.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.color = '#e74c3c';
        });
        
        calorie.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.color = 'white';
        });
    });

    // تأثير للعناصر الغذائية
    document.querySelectorAll('.food-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(-10px)';
            this.style.background = '#edf2f7';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
            this.style.background = '#f8f9fa';
        });
    });

    // تأثير للنصائح
    document.querySelectorAll('.meal-tips li').forEach(tip => {
        tip.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(-5px)';
            this.style.color = '#27ae60';
        });
        
        tip.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
            this.style.color = 'inherit';
        });
    });

    // إضافة تأثير التمرير السلس
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});

// التحقق من صحة الإدخال
function validateInput(input) {
    const value = input.value.trim();
    const formGroup = input.closest('.form-group');
    
    if (input.type === 'number') {
        const num = parseFloat(value);
        if (isNaN(num) || num <= 0) {
            formGroup.classList.add('error');
            return false;
        }
    }
    
    formGroup.classList.remove('error');
    return true;
}

// تحريك شريط الإعلانات
function initAnnouncementBar() {
    const announcements = [
        "🌟 برنامج إنقاص الوزن الأكثر فعالية في الوطن العربي",
        "💪 خطة غذائية متكاملة مع متابعة مستمرة",
        "✨ نتائج مضمونة مع الالتزام بالبرنامج",
        "🏆 أكثر من 1000 متدرب حققوا أهدافهم معنا",
        "📱 دعم فني على مدار الساعة عبر الواتساب"
    ];

    const container = document.querySelector('.announcement-content');
    if (!container) return;

    announcements.forEach(text => {
        const span = document.createElement('span');
        span.textContent = text;
        container.appendChild(span);
    });
}

// تفعيل زر العودة للأعلى
function initScrollToTop() {
    const scrollBtn = document.getElementById('scroll-to-top');
    if (!scrollBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.classList.remove('show');
        }
    });

    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// تفعيل التأثيرات عند التمرير
function initScrollEffects() {
    const elements = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    elements.forEach(element => observer.observe(element));
}

// تحسين أداء التمرير
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// تهيئة جميع الوظائف عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    initAnnouncementBar();
    initScrollToTop();
    initScrollEffects();

    // تحسين أداء التمرير
    window.addEventListener('scroll', debounce(() => {
        // يمكن إضافة وظائف إضافية هنا
    }, 100));
});
