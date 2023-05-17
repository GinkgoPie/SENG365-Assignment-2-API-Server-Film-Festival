type Film = {
    filmId: number,
    title: string,
    genreId: number,
    releaseDate: string,
    directorId: number,
    directorFirstName: string,
    directorLastName: string,
    rating: number,
    ageRating: string
}

type FilmFull = {
    description: string,
    numReviews: number,
    runtime: number
} & Film

type filmReturn = {
    films: film[],
    count: number
}

type Genre = {
    genreId: number,
    name: string
}

type Review = {
    reviewerId: number,
    rating: number,
    review: string,
    reviewerFirstName: string,
    reviewerLastName: string
}

type filmSearchQuery = {
    q?: string,
    directorId?: number,
    reviewerId?: number,
    genreIds?: Array<number>,
    ageRatings?: Array<string>,
    sortBy?: string
    count?: number,
    startIndex?: number
}

type AgeRating = "G" | "PG" | "M" | "R13" | "R15" | "R16" | "R18" | "RP";