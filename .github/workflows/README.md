# GitHub Actions - AWS S3 Deployment

This workflow automatically builds and deploys the crypto-stats application to AWS S3 whenever you push to the `main` branch.

**Authentication**: Uses OIDC (OpenID Connect) for secure, keyless authentication with AWS.

## Setup Instructions

### 1. Create an S3 Bucket

```bash
# Create S3 bucket for static website hosting
aws s3 mb s3://your-bucket-name --region us-east-1

# Enable static website hosting
aws s3 website s3://your-bucket-name --index-document index.html --error-document index.html

# Set bucket policy for public read access
aws s3api put-bucket-policy --bucket your-bucket-name --policy '{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}'
```

### 2. Create OIDC Identity Provider in AWS

1. Go to **AWS IAM Console** → **Identity providers** → **Add provider**
2. Select **OpenID Connect**
3. Set the following:
   - **Provider URL**: `https://token.actions.githubusercontent.com`
   - **Audience**: `sts.amazonaws.com`
4. Click **Add provider**

### 3. Create IAM Role for GitHub Actions

1. Go to **AWS IAM Console** → **Roles** → **Create role**
2. Select **Web identity** as trusted entity type
3. Choose the OIDC provider you just created
4. Set **Audience** to `sts.amazonaws.com`
5. Click **Next**
6. Create and attach a policy with the following permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::your-bucket-name",
        "arn:aws:s3:::your-bucket-name/*"
      ]
    }
  ]
}
```

7. Name the role (e.g., `GitHubActionsS3DeployRole`)
8. After creation, edit the trust policy to restrict to your specific repository:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::YOUR_ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:sharefm/crypto-stats:*"
        }
      }
    }
  ]
}
```

9. Copy the **Role ARN** (e.g., `arn:aws:iam::123456789012:role/GitHubActionsS3DeployRole`)

### 4. Add GitHub Secrets

Go to your GitHub repository: `Settings` → `Secrets and variables` → `Actions` → `New repository secret`

Add the following secrets:

- **AWS_ROLE_ARN**: The IAM role ARN from step 3 (e.g., `arn:aws:iam::123456789012:role/GitHubActionsS3DeployRole`)
- **AWS_REGION**: Your AWS region (e.g., `us-east-1`)
- **S3_BUCKET_NAME**: Your S3 bucket name (e.g., `crypto-stats-app`)

### 4. Deploy

Push to the `main` branch or manually trigger the workflow:

```bash
git add .
git commit -m "Add GitHub Actions workflow"
git push origin main
```

Or trigger manually from GitHub: `Actions` → `Deploy to AWS S3` → `Run workflow`

## Optional: CloudFront Setup

For better performance and HTTPS, set up CloudFront:

1. Create a CloudFront distribution pointing to your S3 bucket
2. Set default root object to `index.html`
3. Configure custom error responses to redirect all errors to `index.html` (for SPA routing)
4. Add the distribution ID as `CLOUDFRONT_DISTRIBUTION_ID` secret

## Viewing Your Site

After deployment, your site will be available at:

- **S3 Website URL**: `http://your-bucket-name.s3-website-region.amazonaws.com`
- **CloudFront URL**: `https://your-distribution-id.cloudfront.net`
- **Custom Domain**: Configure Route 53 or your DNS provider to point to CloudFront

## Workflow Features

- ✅ Automatic deployment on push to `main`
- ✅ Manual deployment via workflow dispatch
- ✅ Production build optimization
- ✅ S3 sync with `--delete` flag (removes old files)
- ✅ Optional CloudFront cache invalidation
- ✅ Uses Node.js 18 with npm caching for faster builds
