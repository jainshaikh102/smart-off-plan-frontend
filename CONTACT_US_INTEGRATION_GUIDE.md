# 📧 Contact Us Integration - Troubleshooting Guide

## 🎯 Overview

This guide helps you troubleshoot the Contact Us form integration between the frontend and backend.

---

## ✅ What I've Fixed

### 1. **Updated ContactUs Component**
- ✅ Added real API integration (replaced simulation)
- ✅ Added loading states and error handling
- ✅ Added proper validation
- ✅ Added error display with user-friendly messages
- ✅ Fixed API endpoint URL to use local backend

### 2. **Environment Configuration**
- ✅ Added `NEXT_PUBLIC_BACKEND_URL=http://localhost:5000` to `.env.local`
- ✅ Updated API call to use correct backend URL

### 3. **Backend API**
- ✅ Contact Us API is working correctly at `http://localhost:5000/api/email/contact-us`
- ✅ Emails are being sent successfully (both admin and customer)
- ✅ Validation is working properly

---

## 🔧 Troubleshooting Steps

### Step 1: Check Backend Server
```bash
# Make sure backend is running
cd smart-off-plan-backend
npm run dev

# Should see: "Server running on port 5000"
```

### Step 2: Test Backend API Directly
```bash
# Test the API endpoint
curl -X POST "http://localhost:5000/api/email/contact-us" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+971501234567", 
    "message": "Test message from API"
  }'

# Should return: {"success":true,"message":"Contact us email sent successfully",...}
```

### Step 3: Check Frontend Environment
```bash
# Make sure .env.local has the correct backend URL
cat .env.local | grep BACKEND_URL

# Should show:
# BACKEND_URL=http://localhost:5000
# NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

### Step 4: Test Frontend Integration
1. Open `test-contact-api.html` in your browser
2. Fill out the form and submit
3. Check browser console for any errors
4. Verify the API response

### Step 5: Check Browser Network Tab
1. Open browser Developer Tools (F12)
2. Go to Network tab
3. Submit the contact form
4. Look for the POST request to `/api/email/contact-us`
5. Check the request/response details

---

## 🚨 Common Issues & Solutions

### Issue 1: "Failed to fetch" Error
**Cause**: Frontend can't reach backend
**Solutions**:
- ✅ Make sure backend server is running on port 5000
- ✅ Check if `NEXT_PUBLIC_BACKEND_URL` is set correctly
- ✅ Verify no CORS issues (backend should allow frontend origin)

### Issue 2: "Validation failed" Error
**Cause**: Form data doesn't meet validation requirements
**Solutions**:
- ✅ Name: 2-100 characters
- ✅ Email: Valid email format
- ✅ Phone: 8-20 characters (if provided)
- ✅ Message: 10-2000 characters

### Issue 3: "Network Error" 
**Cause**: Connection issues between frontend and backend
**Solutions**:
- ✅ Check if backend is running: `http://localhost:5000`
- ✅ Verify firewall/antivirus isn't blocking the connection
- ✅ Try accessing backend directly in browser

### Issue 4: Emails Not Being Received
**Cause**: SendGrid configuration issues
**Solutions**:
- ✅ Check SendGrid API key in backend `.env`
- ✅ Verify sender email is verified in SendGrid
- ✅ Check spam/junk folders
- ✅ Look at backend logs for email sending errors

---

## 🧪 Testing Checklist

### Frontend Testing:
- [ ] Contact form loads without errors
- [ ] All form fields are working
- [ ] Validation messages appear for invalid data
- [ ] Loading state shows when submitting
- [ ] Success message appears after submission
- [ ] Error messages display properly
- [ ] Form resets after successful submission

### Backend Testing:
- [ ] Backend server starts without errors
- [ ] API endpoint responds to POST requests
- [ ] Validation works for all fields
- [ ] Success response includes correct data
- [ ] Error responses include helpful messages

### Email Testing:
- [ ] Admin notification email is sent
- [ ] Customer confirmation email is sent
- [ ] Email templates render correctly
- [ ] All form data appears in emails
- [ ] Emails arrive in reasonable time (< 30 seconds)

---

## 📋 Debug Information

### Current Configuration:
- **Backend URL**: `http://localhost:5000`
- **API Endpoint**: `/api/email/contact-us`
- **Method**: POST
- **Content-Type**: application/json

### Required Fields:
```json
{
  "name": "string (2-100 chars)",
  "email": "valid email",
  "phone": "string (8-20 chars, optional)",
  "message": "string (10-2000 chars)"
}
```

### Expected Response:
```json
{
  "success": true,
  "message": "Contact us email sent successfully",
  "data": {
    "customerName": "Test User",
    "customerEmail": "test@example.com",
    "timestamp": "2025-07-03T13:26:11.585Z"
  }
}
```

---

## 🔍 Debugging Commands

### Check Backend Logs:
```bash
# In backend terminal, look for:
# "📧 Contact us email request from [name] ([email])"
# "✅ All contact us emails sent successfully for [name]"
```

### Check Frontend Console:
```javascript
// In browser console, look for:
// "📧 Submitting contact form: {name, email, phone, message}"
// "✅ Contact form submitted successfully: {response}"
```

### Test API Manually:
```javascript
// Run in browser console:
fetch('http://localhost:5000/api/email/contact-us', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
    phone: '+971501234567',
    message: 'Test message from console'
  })
}).then(r => r.json()).then(console.log);
```

---

## 🎉 Success Indicators

When everything is working correctly, you should see:

1. **Frontend**: Form submits without errors, success message appears
2. **Backend Logs**: "✅ All contact us emails sent successfully"
3. **Email**: Both admin and customer emails received
4. **Network Tab**: 200 OK response from API
5. **Console**: No error messages

---

**If you're still having issues, check the browser console and backend logs for specific error messages.**
