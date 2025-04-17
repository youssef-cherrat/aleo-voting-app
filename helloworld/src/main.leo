program voteuva4projectsp25.aleo {

    /* ────────────────────────
       Data structures
    ──────────────────────── */
    struct ProposalInfo {
        title:    field,
        content:  field,
        proposer: address,
    }

    record Proposal {
        owner: address,
        id:    field,
        info:  ProposalInfo,
    }

    record Ticket {                      // private voting token
        owner: address,
        pid:   field,
    }

    record Vote {
        owner: address,
        pid:   field,
        vote:  u64,      // 1 = agree, 0 = disagree
    }

    /* ────────────────────────
       Public storage
    ──────────────────────── */
    mapping proposals:      field => ProposalInfo;   // id → details
    mapping proposal_ids:   u64   => field;          // index → id
    mapping proposal_count: field => u64;            // 0field → N

    mapping tickets:        field => u64;            // id → #tickets
    mapping agree_votes:    field => u64;            // id → agrees
    mapping disagree_votes: field => u64;            // id → disagrees

    /* ────────────────────────
       Propose
    ──────────────────────── */
    async transition propose(
        public title: field,
        public content: field,
        public proposer: address
    ) -> (Proposal, Future) {
        assert_eq(self.caller, proposer);

        // compute the proposal id locally
        let id: field = BHP256::hash_to_field(title);

        // Return: (record minted off‑chain, future that mutates on‑chain)
        return (
            Proposal {
                owner: self.caller,
                id,
                info: ProposalInfo { title, content, proposer }
            },
            finalize_propose(id, title, content, proposer)
        );
    }

    // All state changes happen here
    async function finalize_propose(
        public id: field,
        public title: field,
        public content: field,
        public proposer: address
    ) {
        // 1. persist full proposal info
        let info: ProposalInfo = ProposalInfo { title, content, proposer };
        Mapping::set(proposals, id, info);

        // 2. append id to index & bump counter
        let n: u64 = Mapping::get_or_use(proposal_count, 0field, 0u64);
        Mapping::set(proposal_ids, n, id);
        Mapping::set(proposal_count, 0field, n + 1u64);

        // 3. initialise ticket counter
        Mapping::set(tickets, id, 0u64);
    }

    /* ────────────────────────
       Mint a voting ticket
    ──────────────────────── */
    async transition new_ticket(
        public pid: field,
        public voter: address,
    ) -> (Ticket, Future) {
        return (
            Ticket { owner: voter, pid },
            finalize_new_ticket(pid)
        );
    }

    async function finalize_new_ticket(public pid: field) {
        let current: u64 = Mapping::get_or_use(tickets, pid, 0u64);
        Mapping::set(tickets, pid, current + 1u64);
    }

    /* ────────────────────────
       Cast votes
    ──────────────────────── */
    async transition agree(ticket: Ticket) -> (Vote, Future) {
        assert_eq(self.caller, ticket.owner);   // caller owns ticket

        return (
            Vote { owner: ticket.owner, pid: ticket.pid, vote: 1u64 },
            finalize_agree(ticket.pid)
        );
    }

    async function finalize_agree(public pid: field) {
        let current: u64 = Mapping::get_or_use(agree_votes, pid, 0u64);
        Mapping::set(agree_votes, pid, current + 1u64);
    }

    async transition disagree(ticket: Ticket) -> (Vote, Future) {
        assert_eq(self.caller, ticket.owner);

        return (
            Vote { owner: ticket.owner, pid: ticket.pid, vote: 0u64 },
            finalize_disagree(ticket.pid)
        );
    }

    async function finalize_disagree(public pid: field) {
        let current: u64 = Mapping::get_or_use(disagree_votes, pid, 0u64);
        Mapping::set(disagree_votes, pid, current + 1u64);
    }
}
