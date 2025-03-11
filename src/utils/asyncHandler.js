const asyncHandler =  (func) => {
    return (req, res, next) => {
        return Promise.resolve(func(req, res, next)).catch(err => next(err));
    }
}

export { asyncHandler };
