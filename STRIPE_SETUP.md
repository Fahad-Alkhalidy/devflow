# Stripe Pro Membership Integration Setup

This document outlines the complete setup process for integrating Stripe payments for pro membership access to the Find Jobs page.

## 🚀 Quick Start

### 1. Install Dependencies
The Stripe dependency has already been added to `package.json`. Run:
```bash
npm install
```

### 2. Environment Variables
Add the following environment variables to your `.env.local` file:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_... # Your Stripe secret key
STRIPE_PUBLISHABLE_KEY=pk_test_... # Your Stripe publishable key
STRIPE_WEBHOOK_SECRET=whsec_... # Webhook endpoint secret

# Stripe Price IDs (create these in Stripe Dashboard)
STRIPE_MONTHLY_PRICE_ID=price_... # Monthly subscription price ID
STRIPE_YEARLY_PRICE_ID=price_... # Yearly subscription price ID

# Public environment variables (for client-side)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... # Same as STRIPE_PUBLISHABLE_KEY
NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID=price_... # Same as STRIPE_MONTHLY_PRICE_ID
NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID=price_... # Same as STRIPE_YEARLY_PRICE_ID
NEXT_PUBLIC_APP_URL=http://localhost:3000 # Your app URL
```

## 📋 Stripe Dashboard Setup

### 1. Create Stripe Account
1. Go to [stripe.com](https://stripe.com) and create an account
2. Complete the account setup and verification process
3. Switch to **Test Mode** for development

### 2. Create Products and Prices
1. Go to **Products** in your Stripe Dashboard
2. Create two products:

#### Monthly Plan
- **Name**: Pro Membership - Monthly
- **Description**: Monthly access to premium job board
- **Pricing**: $9.99/month
- **Billing**: Recurring monthly
- Copy the **Price ID** (starts with `price_`)

#### Yearly Plan
- **Name**: Pro Membership - Yearly
- **Description**: Yearly access to premium job board
- **Pricing**: $99.99/year
- **Billing**: Recurring yearly
- Copy the **Price ID** (starts with `price_`)

### 3. Configure Webhooks
1. Go to **Developers** → **Webhooks** in Stripe Dashboard
2. Click **Add endpoint**
3. **Endpoint URL**: `https://yourdomain.com/api/webhooks/stripe`
4. **Events to send**:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_`)

### 4. Get API Keys
1. Go to **Developers** → **API keys**
2. Copy the **Publishable key** (starts with `pk_test_`)
3. Copy the **Secret key** (starts with `sk_test_`)

## 🔧 Implementation Details

### Features Implemented

#### 1. Database Model
- **ProMembership Model**: Stores subscription details
- **User Association**: Links subscriptions to users
- **Stripe Integration**: Stores Stripe customer and subscription IDs

#### 2. Server Actions
- **createCheckoutSession**: Creates Stripe checkout sessions
- **createCustomerPortal**: Manages subscription billing
- **checkProMembership**: Verifies user's pro status
- **getUserMembership**: Gets user's membership details
- **cancelSubscription**: Cancels active subscriptions
- **reactivateSubscription**: Reactivates canceled subscriptions

#### 3. UI Components
- **PricingCard**: Displays pricing plans with Stripe checkout
- **ProMembershipGuard**: Protects routes requiring pro membership
- **Pricing Page**: Complete pricing page with plan comparison

#### 4. Webhook Handler
- **Real-time Updates**: Handles subscription status changes
- **Payment Processing**: Manages successful/failed payments
- **Subscription Management**: Handles cancellations and updates

#### 5. Route Protection
- **Jobs Page**: Now requires pro membership
- **Graceful Fallback**: Shows upgrade prompt for non-pro users
- **Seamless Experience**: Pro users access jobs normally

## 🎯 User Flow

### For Non-Pro Users
1. User visits `/jobs`
2. **ProMembershipGuard** checks membership status
3. Shows upgrade prompt with pricing plans
4. User clicks "Upgrade to Pro"
5. Redirected to `/pricing` page
6. User selects plan and clicks "Get Started"
7. Redirected to Stripe Checkout
8. After payment, redirected back to `/jobs` with access

### For Pro Users
1. User visits `/jobs`
2. **ProMembershipGuard** verifies active membership
3. User sees jobs page normally
4. Full access to all job board features

## 🔒 Security Features

- **Server-side Validation**: All payment processing on server
- **Webhook Verification**: Stripe signature verification
- **User Authentication**: Requires login for all payment actions
- **Database Integrity**: Proper error handling and rollbacks

## 🧪 Testing

### Test Cards (Stripe Test Mode)
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Insufficient Funds**: `4000 0000 0000 9995`

### Test Scenarios
1. **Successful Payment**: Use test card `4242 4242 4242 4242`
2. **Failed Payment**: Use test card `4000 0000 0000 0002`
3. **Subscription Cancellation**: Test via customer portal
4. **Webhook Events**: Monitor webhook logs in Stripe Dashboard

## 🚀 Production Deployment

### 1. Switch to Live Mode
1. In Stripe Dashboard, toggle to **Live Mode**
2. Create production products and prices
3. Update environment variables with live keys
4. Configure production webhook endpoint

### 2. Environment Variables (Production)
```env
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 3. Webhook Endpoint (Production)
- **URL**: `https://yourdomain.com/api/webhooks/stripe`
- **Events**: Same as development
- **Secret**: Copy from production webhook

## 📊 Monitoring

### Stripe Dashboard
- Monitor payments and subscriptions
- View customer portal usage
- Track webhook delivery status
- Analyze revenue and metrics

### Application Logs
- Webhook processing logs
- Payment success/failure logs
- Subscription status changes
- Error handling and debugging

## 🛠️ Troubleshooting

### Common Issues

#### 1. Webhook Not Receiving Events
- Check webhook endpoint URL
- Verify webhook secret
- Check server logs for errors
- Test with Stripe CLI

#### 2. Payment Not Processing
- Verify API keys are correct
- Check price IDs match Stripe Dashboard
- Ensure user is authenticated
- Check browser console for errors

#### 3. Membership Not Updating
- Check webhook handler logs
- Verify database connection
- Check subscription status in Stripe
- Manually sync subscription data

### Debug Commands
```bash
# Test webhook locally
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Trigger test events
stripe trigger checkout.session.completed
```

## 📈 Next Steps

### Potential Enhancements
1. **Trial Periods**: Add free trial functionality
2. **Multiple Plans**: Add more subscription tiers
3. **Usage Limits**: Implement feature-based limits
4. **Analytics**: Add subscription analytics
5. **Email Notifications**: Send payment confirmations
6. **Refund Handling**: Add refund processing
7. **Proration**: Handle plan upgrades/downgrades

### Integration Points
- **User Dashboard**: Show subscription status
- **Profile Page**: Display membership details
- **Email System**: Send payment receipts
- **Analytics**: Track conversion rates
- **Support**: Integrate with help desk

## 📞 Support

For issues with this implementation:
1. Check Stripe Dashboard for payment status
2. Review application logs for errors
3. Test with Stripe test cards
4. Verify environment variables
5. Check webhook endpoint configuration

---

**Note**: This implementation provides a complete, production-ready Stripe integration for pro membership. All security best practices are followed, and the system is designed to handle edge cases and errors gracefully.
