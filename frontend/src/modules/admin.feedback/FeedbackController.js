

const FeedbackController = ($scope, $http, $window, FeedbackService, AuthService) => {
    const feedbackURL = 'http://localhost:3000/feedback'

    // init
    $scope.loaderStates = {
        coverLoader: true,
        feedbackList: true,
    }

    $scope.feedbackList = []
    $scope.selectedFeedback = null
    $scope.currentPage = 1
    $scope.page = 1
    $scope.totalPages = 0
    $scope.totalFeedbacks = 0
    $scope.limit = 0

    // filter
    $scope.showFilter = false
    $scope.filterData = {
        readState: 'all',
        email: '',
        start_date: '',
        end_date: '',
    }

    // GET LIST FEEDBACK
    $scope.getFeedbacks = () => {
        $scope.feedbackList = []
        $scope.loaderStates.coverLoader = true;
        $scope.loaderStates.feedbackList = true;
        const pageParam = $scope.currentPage - 1
        const readStateParam = $scope.filterData.readState ? `&state=${$scope.filterData.readState}` : ''
        let createdParam = ''
        if ($scope.filterData.start_date && $scope.filterData.end_date) {
            const startDate = new Date($scope.filterData.start_date)
            const endDate = new Date($scope.filterData.end_date)
            if (startDate > endDate) {
                $scope.filterData.start_date = ''
                $scope.filterData.end_date = ''
                alert("Start date must not be greater than the end date")
            } else {
                createdParam = `&start_date=${$scope.filterData.start_date}&end_date=${$scope.filterData.end_date}`
            }
        } else {
            $scope.filterData.start_date = ''
            $scope.filterData.end_date = ''
        }
        const emailParam = $scope.filterData.email ? `&email=${$scope.filterData.email}` : ''

        $http.get(`${feedbackURL}?page=${pageParam}${readStateParam}${createdParam}${emailParam}`)
            .then(res => {
                const data = res.data
                $scope.feedbackList = data.allFeedbacks.map(feedback => {
                    feedback.className = `${feedback.isReaded ? '' : 'feedback__row-unread'}`
                    if ($scope.customers) {

                        const customer = $scope.customers.find(customer => customer.customerId === feedback.user.userid)
                        if (customer) {
                            feedback.user = customer
                            feedback.user.username = `${feedback.user.firstName} ${feedback.user.lastName} `

                        }
                        $http.get(`http://openloyalty.localhost/app_dev.php/api/customer/${feedback.user.userid}`, {
                            headers: {
                                Authorization: `Bearer ${AuthService.idToken.admin_}`
                            }
                        })
                    }
                    return feedback
                })

                if ($scope.filterData.username) {
                    $scope.feedbackList = $scope.feedbackList.filter(feedback => feedback.user.username.includes($scope.filterData.username))
                }

                $scope.limit = data.limit
                $scope.currentPage = parseInt(data.currentPage) + 1
                $scope.page = $scope.currentPage
                $scope.totalFeedbacks = data.totalFeedbacks
                $scope.totalPages = data.totalPages
                $scope.loaderStates.coverLoader = false;
                $scope.loaderStates.feedbackList = false;
                $window.scrollTo(0, 0);
            })
    }




    $scope.viewDetailFeedback = (feedback) => {
        $scope.selectedFeedback = feedback
        $scope.selectedFeedback.isReaded = true
        $scope.selectedFeedback.className = 'feedback__row'
        makeAsRead(feedback.id)
    }

    $scope.closeDetailFeedbackModal = () => {
        $scope.selectedFeedback = null
    }

    const makeAsRead = (feedbackId) => {
        $http.patch(`${feedbackURL}/${feedbackId}`)
            .then(res => {

            })
            .catch(err => {

            })
    }

    $scope.onKeyUpPagination = (e) => {
        if (e.keyCode === 13) {
            if (Number.isInteger($scope.page)) {
                if ($scope.page <= 0) {
                    $scope.page = $scope.currentPage
                }

                while ($scope.page > $scope.totalPages) {
                    $scope.page = Math.floor($scope.page / 10)
                }

                $scope.currentPage = $scope.page
                $scope.getFeedbacks()
            } else {
                alert("InValid Number")
                $scope.page = 1
            }
        }
    }

    $http.get('http://openloyalty.localhost/app_dev.php/api/customer', {
        headers: {
            Authorization: `Bearer ${AuthService.idToken.admin_}`
        }
    })
        .then(res => {
            $scope.customers = res.data.customers
            $scope.getFeedbacks()
        })
        .catch(err => {

        })

    $scope.ShowOrHideFilerForm = () => {
        $scope.showFilter = !$scope.showFilter
    }

    $scope.ApplyFilter = () => {
        $scope.ShowOrHideFilerForm()
        $scope.getFeedbacks()
    }

    $scope.ResetFilter = () => {
        $scope.filterData = {
            readState: 'all',
            email: '',
            start_date: '',
            end_date: '',
        }
        $scope.ShowOrHideFilerForm()
        $scope.getFeedbacks()
    }




}


export default FeedbackController