import { ComplaintStatus } from "../enums/complaint-status.enum";
import { ComplaintType } from "../enums/complaint-type.enum";

export const COMPLAINT_REPOSITORY = 'COMPLAINT_REPOSITORY';

export interface ComplaintRepositoryInterface {
    findPendingComplaintsForOfficeAndServices();
    findOfficesAndServicesHasComplaints();
    updateComplaintStatus(id:number,type: ComplaintType,status: ComplaintStatus);
}