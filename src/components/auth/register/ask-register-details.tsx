import { UniversityType } from '@/types/universities.types';
import React from 'react';
import SelectUniversity from './select-uni';
import CreateUsername from './verify-username';
import LogoutButton from '../logout-button';
import Loader from '@/components/loader';

interface AskRegisterDetailsProps {
    email: string;
}
export default function AskRegisterDetails({
    email,
}: AskRegisterDetailsProps) {
    const [selectedUniversity, setSelectedUniversity] =
        React.useState<UniversityType | undefined>();
    const [isProcessing, setIsProcessing] = React.useState(false);
    return (
        <div className="h-full w-full flex flex-col">
            {isProcessing && (
                <div className="w-screen h-screen bg-background fixed inset-0 flex items-center justify-center">
                    <Loader />
                </div>
            )}
            <nav className="p-5 flex items-center justify-end">
                <div className="flex items-center gap-8">
                    <p className="text-gray-400">{email}</p>
                    <LogoutButton />
                </div>
            </nav>
            <div className="h-full flex items-center justify-center">
                {selectedUniversity ? (
                    <CreateUsername
                        university={selectedUniversity}
                        email={email}
                        setIsProcessing={setIsProcessing}
                        type="register"
                    />
                ) : (
                    <SelectUniversity
                        setIsProcessing={setIsProcessing}
                        selectedUniversity={selectedUniversity}
                        setSelectedUniversity={setSelectedUniversity}
                    />
                )}
            </div>
        </div>
    );
}
