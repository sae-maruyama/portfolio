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
