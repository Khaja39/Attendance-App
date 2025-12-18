export const calculateDuration = (start, end) => {
    // If user hasn't punched out yet
    if (!start || !end) return "Active";
    
    const startTime = new Date(start);
    const endTime = new Date(end);
    const diffMs = endTime - startTime; // Difference in milliseconds

    // Calculate hours and minutes
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
};