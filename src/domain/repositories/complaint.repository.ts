export const COMPLAINT_REPOSITORY = 'COMPLAINT_REPOSITORY';

export interface ComplaintRepositoryInterface {
    findPendingComplaintsForOfficeAndServices();
}