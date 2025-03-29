import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface LoadingButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
    children?: React.ReactNode;
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
    (props, ref) => {
        const { loading, children, className, disabled, ...rest } = props;
        return (
            <Button
                ref={ref}
                className={`w-full ${className || ""}`}
                disabled={loading || disabled}
                {...rest}
            >
                {loading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Please wait
                    </>
                ) : (
                    children
                )}
            </Button>
        );
    }
);
LoadingButton.displayName = "LoadingButton";

export { LoadingButton };
