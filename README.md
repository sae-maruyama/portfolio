MarukoのPortfolio

# Githubへの連携
```
…or create a new repository on the command line
echo "# portfolio" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/sae-maruyama/portfolio.git
git push -u origin main
```

```
…or push an existing repository from the command line
git remote add origin https://github.com/sae-maruyama/portfolio.git
git branch -M main
git push -u origin main
```

# Github Actionを使った自動S3デプロイ方法
1. ID プロバイダを作成する
- まず OIDC に使用する ID プロバイダを AWS で作成する
- IAM コンソールから ID プロバイダ → プロバイダを追加 の順にクリックする
- 各項目を次のように入力する
  - プロバイダのタイプ	OpenID Connect
  - プロバイダの URL	https://token.actions.githubusercontent.com
  - 対象者	sts.amazonaws.com
- これで GitHub Actions 用の ID プロバイダが作成される

2. IAM ロールを作成する
- GitHub Actions で使用する IAM ロールを作成する
- IAM コンソールから ロール → ロールを作成 の順にクリック
- 信頼ポリシーを設定（カスタム信頼ポリシー）
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "",
            "Effect": "Allow",
            "Principal": {
                "Federated": "arn:aws:iam::<AWSアカウントID>:oidc-provider/token.actions.githubusercontent.com"
            },
            "Action": "sts:AssumeRoleWithWebIdentity",
            "Condition": {
                "StringEquals": {
                    "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
                    "token.actions.githubusercontent.com:sub": "repo:<GitHubユーザー名>/<GitHubリポジトリ名>:ref:refs/heads/<ブランチ名>"
                }
            }
        }
    ]
}
```
- IAM ロールにポリシーをアタッチ（今回は AmazonS3FullAccess ポリシーをアタッチ）
- ロール名 に任意のロール名を入力して作成完了

3. GitHub Actions で OIDC を使用して AWS 認証を行う
- ここでようやくワークフローを作成する
- AWS 認証には aws-actions/configure-aws-credentials アクションを使用する
- role-to-assume に IAM ロールの ARN を指定するだけで OIDC を使用した AWS 認証を行ってくれるので便利

```
name: Deploy Portfolio to S3

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: read
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-region: "ap-northeast-1"
          role-to-assume: "arn:aws:iam::<アカウント名>:role/<IAMロール名>"
      
      - name: Deploy to S3
        run: |
          aws s3 sync . s3://<バケット名> \
            --exclude ".git/*" \
            --exclude ".github/*" \
            --exclude "*.md" \
            --delete
            ```
4. Github Actionsで実行状況を確認
- ファイルが変わった部分だけ更新される（全部置き換えではない）
- aws s3 sync は、ファイルのサイズ・最終更新日時をチェックし置き換えを判断する