interface UploadImageProps {
	image: File;
	url?: string;
}

export const uploadImage = async ({ image, url }: UploadImageProps) => {
	if (!url) {
		throw new Error('URL not found');
	}

	const result = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': image.type,
		},
		body: image,
	});

	if (!result.ok) {
		throw new Error('Failed to send message');
	}

	const { storageId } = await result.json();

	return storageId;
};
