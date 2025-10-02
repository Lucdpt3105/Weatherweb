# Weather App - GitHub Pages Deploy Guide

## 🚀 Cách Deploy lên GitHub Pages

### Option 1: Deploy trực tiếp (Đơn giản)

1. **Push code lên GitHub:**
```bash
git add .
git commit -m "Weather app ready for deployment"
git push origin main
```

2. **Enable GitHub Pages:**
- Vào Settings → Pages
- Source: Deploy from a branch
- Branch: main / root
- Save

3. **Access app:**
```
https://yourusername.github.io/repositoryname
```

### Option 2: Secure với Environment (Nâng cao)

Sử dụng GitHub Actions để inject API keys từ Secrets:

1. **Thêm API keys vào GitHub Secrets:**
- Settings → Secrets and variables → Actions
- New repository secret:
  - `OPENWEATHER_API_KEY`: your_openweather_key
  - `UNSPLASH_API_KEY`: your_unsplash_key

2. **Sử dụng GitHub Actions workflow** (xem .github/workflows/deploy.yml)

## ⚠️ Lưu ý quan trọng

- **API Key Security**: Keys sẽ hiện trong source code public
- **Rate Limiting**: Free tier có giới hạn calls/day
- **CORS**: GitHub Pages support HTTPS nên APIs sẽ hoạt động
- **Performance**: Loading có thể chậm hơn local

## 🎯 Kết quả mong đợi

✅ Weather search hoạt động  
✅ Temperature, humidity, pressure display  
✅ Weather icons & country flags  
✅ City suggestions  
✅ Responsive design  
⚠️ Background images (tùy Unsplash rate limit)  
⚠️ API keys exposed in source code

## 🔧 Troubleshooting

**Nếu API không hoạt động:**
1. Check Console (F12) for errors
2. Verify API keys still valid
3. Check rate limits
4. Ensure HTTPS URLs