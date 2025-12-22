import * as React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import messages from "@/messages.json";

export default function Home() {
  return (
    <div className="w-full h-[90vh] outline-1 px-4 flex flex-col">
      
      {/* Heading */}
      <h1 className="text-center pt-8 text-xl sm:text-2xl font-semibold">
        Welcome — One step away from sending messages
      </h1>

      {/* Center Area */}
      <div className="sm:h-[60%] flex flex-1 items-center justify-center  outline-">
        <Carousel className="w-full max-w-xs sm:max-w-sm">
          
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index}>
                <div className="p-2">
                  <Card className="flex flex-col min-h-[260px]">

                    {/* Header */}
                    <CardHeader className="text-center text-sm sm:text-base">
                      {message.title}
                    </CardHeader>

                    {/* Content */}
                    <CardContent className="flex aspect-square items-center justify-center p-4">
                      <span className="text-lg sm:text-2xl text-center font-semibold">
                        {message.content}
                      </span>
                    </CardContent>

                    {/* Footer */}
                    <CardFooter className="text-xs sm:text-sm text-center justify-center">
                      {message.received}
                    </CardFooter>

                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
}
