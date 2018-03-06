#pragma once

struct RenderData
{
	float x;
	float y;
	float w;
	float h;
	float c;
	float s;
};

struct PlatformData : RenderData
{
	float start_x;
	float start_y;
	float end_x;
	float end_y;
};
