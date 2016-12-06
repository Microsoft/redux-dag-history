import {
    IDagHistory,
    StateId,
    BranchId,
    IConfiguration,
} from "../interfaces";
import playBackBookmark from "./playBackBookmark";

export default function playBookmarkStory<T>(history: IDagHistory<T>): IDagHistory<T> {
    if (!Number.isInteger(history.bookmarkPlaybackIndex)) {
        return playBackBookmark(0, history);
    } else {
        return {
            ...history,
            bookmarkPlaybackIndex: null,
        };
    }
}
