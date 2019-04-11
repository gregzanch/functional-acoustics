export default function areGiven() {
    return Array.from(arguments).filter(x => typeof x !== "undefined").length > 0;
}