

export interface EventRegistrationData {
    attendees: Array<{
        first_name: string;
        last_name: string;
        email: string;
        phone: string;
        company: string;
        ticket: number;
        sessions: number[];
    }>
}