import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import apiClient from "@/lib/api-client";
import { LoadingButton } from "./LoadingButton";

type ColumnType = "TEXT" | "DATE";

interface AddColumnDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    sheetId: string;
    onColumnAdded: () => void;
}

export function AddColumnDialog({
    open,
    setOpen,
    sheetId,
    onColumnAdded,
}: AddColumnDialogProps) {
    const [columnName, setColumnName] = useState("");
    const [columnType, setColumnType] = useState<ColumnType>("TEXT");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    // Update the handleSubmit function:

    const handleSubmit = async () => {
        if (!columnName.trim()) {
            setError("Column name is required");
            return;
        }

        setIsSubmitting(true);
        setError("");

        try {
            console.log(`Adding column for sheet ${sheetId}:`, {
                name: columnName,
                dataType: columnType,
            });

            const response = await apiClient.post(
                `/api/dynamic-columns/${sheetId}`,
                {
                    name: columnName,
                    dataType: columnType,
                }
            );

            console.log("Column added response:", response.data);

            // Directly fetch the updated columns list to verify
            const columnsResponse = await apiClient.get(
                `/api/dynamic-columns/${sheetId}`
            );
            console.log("Columns after adding:", columnsResponse.data);

            setColumnName("");
            setColumnType("TEXT");
            setOpen(false);
            onColumnAdded();
        } catch (error) {
            console.error("Failed to add column:", error);
            setError("Failed to add column. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Column</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            value={columnName}
                            onChange={(e) => setColumnName(e.target.value)}
                            className="col-span-3"
                            placeholder="Enter column name"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Type</Label>
                        <RadioGroup
                            value={columnType}
                            onValueChange={(value) =>
                                setColumnType(value as ColumnType)
                            }
                            className="col-span-3"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="TEXT" id="text" />
                                <Label htmlFor="text">Text</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="DATE" id="date" />
                                <Label htmlFor="date">Date</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    {error && (
                        <div className="text-sm text-red-500 col-span-4">
                            {error}
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <LoadingButton
                        type="submit"
                        onClick={handleSubmit}
                        loading={isSubmitting}
                    >
                        {isSubmitting ? "Adding..." : "Add Column"}
                    </LoadingButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
