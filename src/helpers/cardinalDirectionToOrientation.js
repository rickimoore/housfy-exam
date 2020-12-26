const cardinalDirectionToOrientation = (direction) => {
    switch (direction) {
        case 'N':
            return 0;
        case 'S':
            return 2;
        case 'E':
            return 1;
        case 'W':
            return 3;
        default:
            return 0;
    }
}

export default cardinalDirectionToOrientation;
