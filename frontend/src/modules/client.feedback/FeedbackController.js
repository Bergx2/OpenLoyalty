

const FeedbackController = ($scope, AuthService, $http, $state) => {
    const feedbackURL = 'http://localhost:3000/feedback'
    const userId = AuthService.getLoggedUserId();


    $scope.title = "";
    $scope.description = "";

    $scope.sendFeedback = (e) => {
        e.preventDefault()
        const dataForm = {
            userId,
            title: $scope.title,
            content: $scope.description
        }
        $http.post(feedbackURL, dataForm)
            .then((res) => {
                const success = res.data.success
                if (success) {
                    alert("Send Feedback Successfully!")
                    $scope.title = "";
                    $scope.description = "";
                    $state.go('customer.panel.dashboard')
                } else {
                    alert("Send Feedback Failed!")
                }
            })
    }

}


export default FeedbackController