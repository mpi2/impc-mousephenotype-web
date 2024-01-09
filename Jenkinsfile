pipeline {
  agent any
  tools {
    nodejs 'NodeJS'
  }
  stages {
    stage('Build Frontend') {
      steps {
        //sh 'yarn'
        //sh 'yarn build'
      }
    }
    stage('Push to ECR') {
      steps {
        script {
          sh 'aws ecr get-login-password --region eu-west-2 | docker login --username AWS --password-stdin 655093420076.dkr.ecr.eu-west-2.amazonaws.com'
          sh 'docker build -t impc-nextjs-frontend .'
          sh 'docker tag impc-nextjs-frontend:latest 655093420076.dkr.ecr.eu-west-2.amazonaws.com/impc-nextjs-frontend:latest'
          sh 'docker push 655093420076.dkr.ecr.eu-west-2.amazonaws.com/impc-nextjs-frontend:latest'
        }
      }
    }
    stage('Redeploy in Kubernetes') {
      steps {
        script {
          sh 'kubectl get pods -o wide'
          sh 'kubectl delete deploy impc-nextjs-frontend'
          sh 'kubectl apply -f impc-nextjs-frontend-deployment.yaml'
          sleep 3
          sh 'kubectl get pods -o wide'
        }
      }
    }
  }
}

