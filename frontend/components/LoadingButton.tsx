import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const LoadingButton = React.forwardRef((props, ref) => {
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
});
LoadingButton.displayName = "LoadingButton";

export { LoadingButton };
