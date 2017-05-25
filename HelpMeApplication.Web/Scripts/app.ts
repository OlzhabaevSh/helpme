declare var angular: any;
declare var $: any;

enum HelpMeControllerState {
    Start = 0,
    List = 1,
    Create = 2,
    Detail = 3
}

interface ITicket {
    Guid: string;
    AuthorName: string;
    Head: string;
    Body: string;
    Comments?: IComment[];
}

interface IComment {
    AuthorName: string;
    Message: string;
}

class HelpMeService {

    public ticketCreatedCallbacks: Array<(ticket: ITicket) => void> = [];

    public commentCreatedCallbacks: Array<(ticketId: string, comment: IComment) => void> = [];

    public loadCallbacks: Array<(tickets: ITicket[]) => void> = [];

    private service: any;

    constructor() {
        let jq: any = $;
        this.service = jq.connection.ticketsHub;

        this.service.client.loadTickets = (tickets: ITicket[]) => {
            this.loadCallbacks.forEach(item => {
                item(tickets);
            });
        };

        this.service.client.ticketCreated = (ticket: ITicket) => {
            this.ticketCreatedCallbacks.forEach(item => {
                item(ticket);
            });
        };
        
        this.service.client.commentCreated = (ticketId: string, comment: IComment) => {
            this.commentCreatedCallbacks.forEach(item => {
                item(ticketId, comment);
            });
        };
    }

    public Start(): void {
        let jq: any = $;
        jq.connection.hub.start();
    }

    public createTicket(ticket: ITicket) {
        this.service.server.createTicket(ticket);
    }

    public createComment(ticketId: string, comment: IComment) {
        this.service.server.createComment(ticketId, comment);
    }

    public clear() {
        this.service.server.clear();
    }

}

class HelpMeController {

    public state: HelpMeControllerState = HelpMeControllerState.Start;

    public user = { name: "" };

    public tickets: ITicket[] = [];

    public selectedTicket: ITicket;

    public nwTicket: ITicket;

    public nwComment: string = "";

    static $inject = ['$scope', 'helpMeService'];
    constructor(private $scope: any, private helpMeService: HelpMeService) {

    }

    public init() {

        this.helpMeService.loadCallbacks.push((tickets) => {
            console.log('loaded!');
            this.tickets = tickets;
            this.$scope.$apply();
        });

        this.helpMeService.ticketCreatedCallbacks.push((ticket) => {
            this.tickets.push(ticket);
            this.$scope.$apply();
        });
        this.helpMeService.commentCreatedCallbacks.push((ticketId, comment) => {
            var item = this.tickets.filter(x => x.Guid == ticketId)[0];
            item.Comments.push(comment);
            this.$scope.$apply();
        });
    }

    public login() {
        this.state = HelpMeControllerState.List;
        this.helpMeService.Start();
    }

    public create() {
        this.state = HelpMeControllerState.Create;
        this.selectedTicket = null;
        this.clear();
    }

    public select(item: ITicket) {
        if (this.state != HelpMeControllerState.Detail) {
            this.selectedTicket = item;
            this.state = HelpMeControllerState.Detail;
        }
        else {
            this.selectedTicket = null;
            this.state = HelpMeControllerState.List;
            this.clear();
        }
    }

    public submit() {

        this.nwTicket.AuthorName = this.user.name;
        this.helpMeService.createTicket(this.nwTicket);

        this.state = HelpMeControllerState.List;
        this.clear();
    }

    public createComment() {
        let id = this.selectedTicket.Guid;
        this.helpMeService.createComment(id, {
            AuthorName: this.user.name,
            Message: this.nwComment
        });
        this.clear();
    }

    private clear() {
        this.nwTicket = {
            Guid: '',
            Head: '',
            AuthorName: '',
            Body: '',
            Comments: []
        };
        this.nwComment = "";
    }

    public deleteAll() {
        this.helpMeService.clear();
        this.state = HelpMeControllerState.List;
    }

}

angular.
    module('helpMeMdl', []).
    service('helpMeService', HelpMeService).
    controller('helpMeCtrl', HelpMeController)