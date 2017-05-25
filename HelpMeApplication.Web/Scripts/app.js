var HelpMeControllerState;
(function (HelpMeControllerState) {
    HelpMeControllerState[HelpMeControllerState["Start"] = 0] = "Start";
    HelpMeControllerState[HelpMeControllerState["List"] = 1] = "List";
    HelpMeControllerState[HelpMeControllerState["Create"] = 2] = "Create";
    HelpMeControllerState[HelpMeControllerState["Detail"] = 3] = "Detail";
})(HelpMeControllerState || (HelpMeControllerState = {}));
var HelpMeService = (function () {
    function HelpMeService() {
        var _this = this;
        this.ticketCreatedCallbacks = [];
        this.commentCreatedCallbacks = [];
        this.loadCallbacks = [];
        var jq = $;
        this.service = jq.connection.ticketsHub;
        this.service.client.loadTickets = function (tickets) {
            _this.loadCallbacks.forEach(function (item) {
                item(tickets);
            });
        };
        this.service.client.ticketCreated = function (ticket) {
            _this.ticketCreatedCallbacks.forEach(function (item) {
                item(ticket);
            });
        };
        this.service.client.commentCreated = function (ticketId, comment) {
            _this.commentCreatedCallbacks.forEach(function (item) {
                item(ticketId, comment);
            });
        };
    }
    HelpMeService.prototype.Start = function () {
        var jq = $;
        jq.connection.hub.start();
    };
    HelpMeService.prototype.createTicket = function (ticket) {
        this.service.server.createTicket(ticket);
    };
    HelpMeService.prototype.createComment = function (ticketId, comment) {
        this.service.server.createComment(ticketId, comment);
    };
    HelpMeService.prototype.clear = function () {
        this.service.server.clear();
    };
    return HelpMeService;
}());
var HelpMeController = (function () {
    function HelpMeController($scope, helpMeService) {
        this.$scope = $scope;
        this.helpMeService = helpMeService;
        this.state = HelpMeControllerState.Start;
        this.user = { name: "" };
        this.tickets = [];
        this.nwComment = "";
    }
    HelpMeController.prototype.init = function () {
        var _this = this;
        this.helpMeService.loadCallbacks.push(function (tickets) {
            console.log('loaded!');
            _this.tickets = tickets;
            _this.$scope.$apply();
        });
        this.helpMeService.ticketCreatedCallbacks.push(function (ticket) {
            _this.tickets.push(ticket);
            _this.$scope.$apply();
        });
        this.helpMeService.commentCreatedCallbacks.push(function (ticketId, comment) {
            var item = _this.tickets.filter(function (x) { return x.Guid == ticketId; })[0];
            item.Comments.push(comment);
            _this.$scope.$apply();
        });
    };
    HelpMeController.prototype.login = function () {
        this.state = HelpMeControllerState.List;
        this.helpMeService.Start();
    };
    HelpMeController.prototype.create = function () {
        this.state = HelpMeControllerState.Create;
        this.selectedTicket = null;
        this.clear();
    };
    HelpMeController.prototype.select = function (item) {
        if (this.state != HelpMeControllerState.Detail) {
            this.selectedTicket = item;
            this.state = HelpMeControllerState.Detail;
        }
        else {
            this.selectedTicket = null;
            this.state = HelpMeControllerState.List;
            this.clear();
        }
    };
    HelpMeController.prototype.submit = function () {
        this.nwTicket.AuthorName = this.user.name;
        this.helpMeService.createTicket(this.nwTicket);
        this.state = HelpMeControllerState.List;
        this.clear();
    };
    HelpMeController.prototype.createComment = function () {
        var id = this.selectedTicket.Guid;
        this.helpMeService.createComment(id, {
            AuthorName: this.user.name,
            Message: this.nwComment
        });
        this.clear();
    };
    HelpMeController.prototype.clear = function () {
        this.nwTicket = {
            Guid: '',
            Head: '',
            AuthorName: '',
            Body: '',
            Comments: []
        };
        this.nwComment = "";
    };
    HelpMeController.prototype.deleteAll = function () {
        this.helpMeService.clear();
        this.state = HelpMeControllerState.List;
    };
    return HelpMeController;
}());
HelpMeController.$inject = ['$scope', 'helpMeService'];
angular.
    module('helpMeMdl', []).
    service('helpMeService', HelpMeService).
    controller('helpMeCtrl', HelpMeController);
//# sourceMappingURL=app.js.map