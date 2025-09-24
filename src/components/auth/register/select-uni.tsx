import React from 'react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { UniversityType } from '@/types/universities.types';
import { CircleHelp } from 'lucide-react';
import { customFetch } from '@/lib/custom-fetch';

type SelectUniversityProps = {
    selectedUniversity: UniversityType | undefined;
    setSelectedUniversity: React.Dispatch<
        React.SetStateAction<UniversityType | undefined>
    >;
    setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function SelectUniversity({
    selectedUniversity,
    setSelectedUniversity,
    setIsProcessing,
}: SelectUniversityProps) {
    const [universities, setUniversities] = React.useState<
        UniversityType[]
    >([]);
    React.useEffect(() => {
        const fetchUniversities = async () => {
            try {
                const response = await customFetch(
                    '/auth/get-colleges',
                    { method: 'GET' }
                );
                const data = await response.json();
                if (response?.ok) setUniversities(data.data.data);
                else throw new Error(data?.message || data?.data?.message);
            } catch (error) {
                console.error(error);
            }
        };
        if (!universities.length) fetchUniversities();
    }, [universities.length]);
    return (
        <div className="sm:w-3/4 md:w-1/2 w-11/12">
            <h2 className="text-3xl font-bold text-center mb-1 ">
                Yo! 🎓 Pick Your Campus and Let the Chaos Begin!
            </h2>
            <p className="text-center text-gray-500 mb-6">
                Procrastination is optional, but recommended!
            </p>
            <Select
                value={selectedUniversity?._id || ''}
                onValueChange={(value: string) => {
                    const selectedUni = universities.find(
                        (university) => university._id === value
                    );
                    setIsProcessing(true);
                    setTimeout(() => {
                        setIsProcessing(false);
                        setSelectedUniversity(selectedUni);
                    }, 1000);
                }}
            >
                <SelectTrigger className="">
                    <SelectValue placeholder="Select a university">
                        {selectedUniversity?.name}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>INDIA</SelectLabel>
                        {universities.map((university) => (
                            <SelectItem
                                key={university._id}
                                value={university._id || ''}
                            >
                                {university.name}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
            <div className=" flex gap-2 text-sm items-center text-red-400 mt-4">
                <CircleHelp className="sm:h-5 sm:w-5 h-10 w-10" />
                <p>
                    No clue where your university is? Relax, we’ve got
                    you.{' '}
                    <strong>
                        <strong>Hit us up</strong>{' '}
                    </strong>{' '}
                    us a note, and we’ll hunt it down like lost hostel
                    food!
                </p>
            </div>
        </div>
    );
}
