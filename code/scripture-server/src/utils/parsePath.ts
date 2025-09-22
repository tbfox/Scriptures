export const parsePath = (req: Request) => {
    const url = new URL(req.url);
    return {
        path: url.pathname.split("/").filter((item) => item !== ""),
        searchParams: url.searchParams,
    };
};
