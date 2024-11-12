<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ProjectBoardEvent  implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */

     public $projectCode;
     public function __construct($projectCode)
     {
         $this->projectCode = $projectCode;
     }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): Channel
    {
        // This method is responsible for returning 
        // the channel that the event should broadcast on

        //broadcast on multiple channels
        // return [
        //     new PrivateChannel("channel-name"),
        // ];

        // Single channel
        return  new PresenceChannel("project.room.{$this->projectCode}");
        

    

        //public channel

        // we pass only 
        // return new Channel('channel-name')
    }
}
