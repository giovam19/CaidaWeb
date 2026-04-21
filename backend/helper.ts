import { Socket } from "socket.io";
import SeatDTO from "../shared/DTO/SeatDTO";
import UserDTO from "../shared/DTO/UserDTO";

export interface CustomSocket extends Socket {
    user?: UserDTO;
    actualSeat?: SeatDTO | null
}

export function EmptyOrRows(rows: any[]): any[] {
    if (!rows) {
        return [];
    }
    return rows;
}
