import React, { useState, ChangeEvent } from 'react';
import ImageUpload from './components/image-upload/image-upload';
import {
	updateImageUploads,
	setImageUploadError,
	getFileDataUrl,
} from './components/image-upload/utils';
import './App.css';

export type Ids = 'main' | 'extra1';
export type ImageUpload = {
	id: Ids;
	file: File | null;
	url: string;
	loading: boolean;
	errorMessage: string | null;
};

function App() {
	const [imageUploads, setImageUploads] = useState<ImageUpload[]>([
		{
			id: 'main',
			file: null,
			url: '',
			loading: false,
			errorMessage: null,
		},
		{
			id: 'extra1',
			file: null,
			url: '',
			loading: false,
			errorMessage: null,
		},
	]);

	const onImageUploadChange = async (
		e: ChangeEvent<HTMLInputElement>,
		id: Ids
	) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// set loading state
		setImageUploads(
			updateImageUploads(imageUploads, id, {
				file: null,
				url: '',
				loading: true,
				errorMessage: null,
			})
		);

		// validate file
		const validExts = ['jpg', 'png', 'jpeg'];
		const maxFileSize = 5;

		const fileExt = file.name.substring(file.name.lastIndexOf('.') + 1);
		const fileSize = file.size / 1000000; // size in mb

		if (!validExts.includes(fileExt)) {
			setImageUploads((prevImageUploads) =>
				setImageUploadError(
					prevImageUploads,
					id,
					`invalid file extension. supported extensions (${validExts.join(
						' '
					)})`
				)
			);
			return;
		}

		if (fileSize > maxFileSize) {
			setImageUploads(
				setImageUploadError(
					imageUploads,
					id,
					`Image is too big (max ${maxFileSize}mb)`
				)
			);
			return;
		}

		const dataUrl = await getFileDataUrl(file);

		setImageUploads(
			updateImageUploads(imageUploads, id, {
				file,
				url: dataUrl,
				loading: false,
				errorMessage: null,
			})
		);
	};

	const onImageUploadCancel = (id: Ids) => {
		setImageUploads(
			updateImageUploads(imageUploads, id, {
				loading: false,
				errorMessage: null,
				file: null,
				url: '',
			})
		);
	};

	return (
		<div className='App'>
			{imageUploads.map(({ url, id, errorMessage, loading, file }) => (
				<ImageUpload
					key={id}
					inputId={id}
					url={url}
					errorMessage={errorMessage}
					loading={loading}
					onChange={(e) => onImageUploadChange(e, id)}
					onCancel={() => onImageUploadCancel(id)}
				/>
			))}
		</div>
	);
}

export default App;
