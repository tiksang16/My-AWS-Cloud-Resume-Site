# Cloud Resume Website

This repository contains the code and deployment configuration for my **Cloud Resume Website**. The site is built, hosted, and deployed on AWS using various services, including **S3**, **CloudFront**, **Route 53**, **API Gateway**, **Lambda**, and **DynamoDB**. Below, I outline the steps and services I used to build and deploy the project.

---

## **Technologies Used**
- **AWS S3**: Static website hosting.
- **AWS CloudFront**: Content delivery and HTTPS.
- **Amazon Route 53**: Domain registration and DNS management.
- **AWS DynamoDB**: NoSQL database for storing visitor count.
- **AWS Lambda**: Serverless function to handle backend logic.
- **AWS API Gateway**: REST API to connect the frontend with the backend.
- **GitHub Actions**: CI/CD pipeline for automated deployment.
- **IAM**: Secure access management for AWS resources.

---

## **Demo**
You can view my live resume website here: [Tik Sang Chan - Resume](https://www.tik-sang.net/)

---

## **Features**
- Hosted on **Amazon S3** as a static website.
- Secured and accelerated with **CloudFront** (CDN).
- Domain registered and managed with **Amazon Route 53**.
- Visitor counter implemented with **DynamoDB**, **API Gateway**, and **Lambda**.
- Automated deployment using **GitHub Actions** for CI/CD.
- Managed with **IAM** to ensure secure access to AWS resources.

---

## **Deployment Process**

### **1. Create the Resume Website**
- Designed and built a personal resume website using HTML, CSS, and optionally JavaScript.
- Stored all the website files (e.g., `index.html`, `style.css`) in the repository.

---

### **2. Register a Custom Domain with Amazon Route 53**
1. **Domain Registration:**
   - Registered my custom domain `https://www.tik-sang.net/` using **Amazon Route 53**.
   - Configured the hosted zone in Route 53 to manage DNS records for the domain.

2. **Domain Integration with CloudFront:**
   - Created an `A` record in Route 53 to point the domain to the CloudFront distribution.
   - Enabled HTTPS with an **AWS Certificate Manager (ACM)** certificate for the domain.

---

### **3. Set Up AWS S3 for Static Website Hosting**
1. **Create an S3 bucket:**
   - Created an S3 bucket (e.g., `my-resume-bucket`) in the AWS Management Console.
   - Enabled **static website hosting** under the bucket properties.
   - Uploaded the website files to the bucket.

2. **Set permissions:**
   - Configured the S3 bucket policy to make the website publicly accessible.
   - Example bucket policy:
     ```json
     {
       "Version": "2012-10-17",
       "Statement": [
         {
           "Sid": "PublicReadGetObject",
           "Effect": "Allow",
           "Principal": "*",
           "Action": "s3:GetObject",
           "Resource": "arn:aws:s3:::my-resume-bucket/*"
         }
       ]
     }
     ```

---

### **4. Use CloudFront for Content Delivery**
1. **Create a CloudFront distribution:**
   - Configured CloudFront to serve the static content from the S3 bucket.
   - Set the S3 bucket as the **origin**.
   - Enabled custom error responses for better user experience (e.g., `404.html`).

2. **Enable HTTPS:**
   - Used an **AWS Certificate Manager (ACM)** certificate to enable HTTPS for the CloudFront distribution.
   - Configured the domain in Route 53 to point to the CloudFront distribution.

---

### **5. Implement a Visitor Counter**
1. **JavaScript for Visitor Counter:**
   - Added a JavaScript function to fetch and display the visitor count for the resume webpage.
   - Example JavaScript code:
     ```javascript
     async function updateVisitorCount() {
       const apiUrl = "https://<your-api-gateway-url>/prod/visitor-count";
       try {
         const response = await fetch(apiUrl);
         const data = await response.json();
         document.getElementById("visitor-count").innerText = data.count;
       } catch (error) {
         console.error("Error fetching visitor count:", error);
       }
     }
     updateVisitorCount();
     ```

2. **AWS DynamoDB:**
   - Created a DynamoDB table (`VisitorCount`) to store the visitor count.
   - The table has a single primary key (`id`) with a default value of `1` to track the count.

3. **AWS Lambda Function:**
   - Wrote a Python Lambda function to retrieve and update the visitor count in DynamoDB.
   - Example Lambda function:
     ```python
     import boto3
     import json

     dynamodb = boto3.resource('dynamodb')
     table = dynamodb.Table('VisitorCount')

     def lambda_handler(event, context):
         # Retrieve the current count
         response = table.get_item(Key={'id': '1'})
         count = response['Item']['count']

         # Increment the count
         count += 1
         table.update_item(
             Key={'id': '1'},
             UpdateExpression='SET count = :val',
             ExpressionAttributeValues={':val': count}
         )

         return {
             'statusCode': 200,
             'headers': {
                 'Access-Control-Allow-Origin': '*'
             },
             'body': json.dumps({'count': count})
         }
     ```

4. **AWS API Gateway:**
   - Created an API Gateway endpoint to invoke the Lambda function and expose it as a RESTful API.
   - Configured the API to accept `GET` requests and return the visitor count.

5. **Integrate API with Frontend:**
   - Added the API Gateway URL to the JavaScript function to fetch and display the visitor count on the webpage.

---

### **6. Automate Deployment with GitHub Actions**
1. **Set up GitHub Actions workflow:**
   - Created a `.github/workflows/deploy.yml` file to automate deployment.
   - Configured the workflow to:
     - Sync files from the repository to the S3 bucket.
     - Invalidate the CloudFront cache after deployment.

2. **Example workflow file:**
   ```yaml
   name: Deploy to S3 and Invalidate CloudFront Cache

   on:
     push:
       branches:
         - main

   jobs:
     deploy:
       runs-on: ubuntu-latest

       steps:
         # Step 1: Check out the code
         - name: Checkout code
           uses: actions/checkout@v3

         # Step 2: Configure AWS credentials
         - name: Configure AWS credentials
           uses: aws-actions/configure-aws-credentials@v3
           with:
             aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
             aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
             aws-region: ${{ secrets.AWS_REGION }}

         # Step 3: Sync files to S3
         - name: Sync files to S3
           run: |
             aws s3 sync . s3://my-resume-bucket --delete

         # Step 4: Invalidate CloudFront cache
         - name: Invalidate CloudFront cache
           run: |
             aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} --paths "/*"

---

## **7. Secure Access with IAM**
1. **Created an IAM user:**
   - Created a dedicated IAM user for the CI/CD pipeline with **programmatic access**.
   - Attached a custom policy to grant the user access to S3, CloudFront, DynamoDB, and Lambda.

2. **Example policy:**
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "s3:ListBucket",
           "s3:PutObject",
           "s3:GetObject",
           "s3:DeleteObject"
         ],
         "Resource": [
           "arn:aws:s3:::my-resume-bucket",
           "arn:aws:s3:::my-resume-bucket/*"
         ]
       },
       {
         "Effect": "Allow",
         "Action": [
           "cloudfront:CreateInvalidation"
         ],
         "Resource": "*"
       },
       {
         "Effect": "Allow",
         "Action": [
           "dynamodb:GetItem",
           "dynamodb:UpdateItem"
         ],
         "Resource": "arn:aws:dynamodb:<region>:<account-id>:table/VisitorCount"
       },
       {
         "Effect": "Allow",
         "Action": [
           "lambda:InvokeFunction"
         ],
         "Resource": "arn:aws:lambda:<region>:<account-id>:function:<function-name>"
       }
     ]
   }

3. **Stored IAM credentials as GitHub Secrets:**
   - Added the following secrets in the GitHub repository:
     - AWS_ACCESS_KEY_ID: The access key ID for the IAM user.
     - AWS_SECRET_ACCESS_KEY: The secret access key for the IAM user.
     - AWS_REGION: The AWS region where the resources are deployed (e.g., us-east-1).
     - CLOUDFRONT_DISTRIBUTION_ID: The ID of the CloudFront distribution.