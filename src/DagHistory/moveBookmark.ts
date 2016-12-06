const log = require("debug")("redux-dag-history:DagHistory");
import DagGraph from "../DagGraph";
import {
    IDagHistory,
    StateId,
    BranchId,
    IConfiguration,
} from "../interfaces";

export default function moveBookmark<T>(from: number, to: number, history: IDagHistory<T>): IDagHistory<T> {
    log("moving bookmark at %s to %s", from, to);
    const result = { ...history };
    if (from < to) {
        to--;
    }
    result.bookmarks.splice(to, 0, result.bookmarks.splice(from, 1)[0]);
    return result;
}
