import csv
import io

from fastapi import HTTPException, UploadFile


class CSVService:

    async def read_reviews(self, file: UploadFile) -> list[str]:
        ALLOWED_TYPES = {
            "text/csv",
            "application/vnd.ms-excel"
        }

        if file.content_type not in ALLOWED_TYPES:
            raise HTTPException(
                status_code=400,
                detail="Only CSV files are allowed"
            )

        content = await file.read()
        text = content.decode("utf-8")

        reader = csv.DictReader(io.StringIO(text))

        if reader.fieldnames is None:
            raise HTTPException(
                status_code=400,
                detail="The uploaded CSV is empty."
            )

        headers = [header.strip().lower() for header in reader.fieldnames]

        if "feedback" not in headers:
            raise HTTPException(
                status_code=400,
                detail="CSV must contain a 'feedback' column."
            )

        review_column = next(
            header
            for header in reader.fieldnames
            if header.strip().lower() == "feedback"
        )

        reviews = []

        for row in reader:
            review = row.get(review_column, "").strip()

            if review:
                reviews.append(review)

        return reviews