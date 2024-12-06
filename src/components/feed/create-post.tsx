'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { RocketIcon, XCircleIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { useDispatch } from 'react-redux';
import { resetView } from '@/app/store/view-slice';
import { customFetch } from '@/lib/custom-fetch';

export default function CreatePost() {
    const searchParams = useSearchParams();
    const category = searchParams.get('type') || 'forum';
    const dispatch = useDispatch();

    const [attachments, setAttachments] = useState<File[]>([]);
    const [caption, setCaption] = useState('');

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (e.target.files) {
            const validFiles = Array.from(e.target.files).filter(
                (file) =>
                    file.type.startsWith('image/') ||
                    file.type.startsWith('video/')
            );
            if (validFiles.length !== e.target.files.length) {
                alert('Only images and videos are allowed!');
            }
            setAttachments((prev) => [...prev, ...validFiles]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = {
                category,
                caption,
                attachments: attachments.map((file) => {
                    return {
                        type: file.type.split('/')[0],
                        url: URL.createObjectURL(file),
                    };
                }),
            };
            console.log(data);
            // API call to post the data.  The server will handle file uploads
            const response = await customFetch('/user/create-post', {
                method: 'POST',
                body: JSON.stringify(data),
            });

            if (response.ok) {
                alert('Post created successfully!');
                dispatch(resetView());
            } else {
                const errorData = await response.json(); // Try to get error details from the response.
                alert(
                    `Failed to create post! ${
                        errorData?.data ||
                        errorData?.message ||
                        'Unknown error'
                    }`
                );
            }
        } catch (error) {
            console.error('Error submitting post:', error); // Log the actual error for debugging.
        }
    };

    const renderHeading = () => {
        switch (category) {
            case 'forum':
                return 'Speak Your Mind on the Forum!';
            case 'lostAndFound':
                return '🔍 Lost Something? Found Something? Share Here!';
            case 'confession':
                return '🤫 Spill the Tea in Confessions!';
            default:
                return '📝 Create a New Post';
        }
    };

    return (
        <div className="h-full w-full flex flex-col justify-between p-4">
            <div>
                <div className="text-start mb-4">
                    <h1 className="text-3xl font-bold ">
                        {renderHeading()}
                    </h1>
                    <p className="text-sm text-gray-500">
                        Category:{' '}
                        <span className="capitalize">{category}</span>
                    </p>
                </div>

                <div className="flex flex-col gap-4 mt-2">
                    <div className="relative w-full min-w-[200px]">
                        <textarea
                            rows={8}
                            className="peer h-full min-h-[100px] w-full !resize-none  rounded-[7px] border border-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal  outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-gray-200 placeholder-shown:border-t-gray-200 focus:border-2 focus:border-white focus:border-t-transparent focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-gray-400"
                            placeholder=" "
                            onChange={(e) =>
                                setCaption(e.target.value)
                            }
                        ></textarea>
                        <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-white peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-white peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-white peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                            Type Your Comment Here
                        </label>
                    </div>

                    <div className="space-y-2">
                        <label className="block font-medium text-gray-600">
                            Add Attachments 📎 (Images/Videos)
                        </label>
                        <input
                            id="fileInput"
                            type="file"
                            accept="image/*,video/*"
                            multiple
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        <button
                            type="button"
                            onClick={() =>
                                document
                                    .getElementById('fileInput')
                                    ?.click()
                            }
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Choose Files
                        </button>
                    </div>
                </div>
            </div>
            {attachments.length > 0 && (
                <div className="overflow-x-auto flex gap-2 mt-4">
                    {attachments.map((file, index) => (
                        <div
                            key={index}
                            className="flex-shrink-0 w-24 h-24"
                        >
                            {file.type.startsWith('image/') ? (
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt="Preview"
                                    className="w-full h-full object-cover rounded-md"
                                />
                            ) : (
                                <video
                                    src={URL.createObjectURL(file)}
                                    className="w-full h-full object-cover rounded-md"
                                    controls
                                />
                            )}
                        </div>
                    ))}
                </div>
            )}
            <div className="flex justify-end items-center mt-4 gap-2">
                <Button
                    type="button"
                    variant={'destructive'}
                    className="text-lg"
                    onClick={() => dispatch(resetView())}
                >
                    <XCircleIcon className=" h-5 w-5 inline-block" />{' '}
                    Close
                </Button>
                <Button
                    type="submit"
                    onClick={handleSubmit}
                    className="text-lg"
                >
                    <RocketIcon className="h-5 w-5 inline-block" />{' '}
                    Post It!
                </Button>
            </div>
        </div>
    );
}
