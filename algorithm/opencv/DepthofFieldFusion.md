# 景深合成算法

Opencv-4.10 景深合成算法

## 算法原理


## Code

```cpp
// depth of field fusion .cpp


#include "depthSynthesis.h"

template<class T> inline size_t argmax(T first, T last)
{
	return std::distance(first, std::max_element(first, last));
}
	
cv::Mat collapsePyramid(std::vector<cv::Mat> inputPyrs, int level)
{
	cv::Mat curImg = inputPyrs[level - 1], tmp;
	for (int i = level - 1; i > 0; i--) {
		cv::pyrUp(curImg, tmp, inputPyrs[i - 1].size());
		curImg = tmp + inputPyrs[i - 1];
	}
	return curImg;
}

// sml
cv::Mat sml(const cv::Mat & src, cv::Mat xkernal, cv::Mat ykernal)
{
	cv::Mat LX, LY, L;
	cv::filter2D(src, LX, -1, xkernal);
	cv::filter2D(src, LY, -1, ykernal);
	cv::Mat dst = abs(LX) + abs(LY);
	return dst;
}

// SMLPyramid
std::vector<cv::Mat> SMLPyramid(cv::Mat & img, int level)
{
	std::vector<cv::Mat> output;
	cv::Mat currentImg = img.clone(), downImg, tempImg;
	const cv::Mat xkernal = (cv::Mat_<float>(3, 3) << 0, 0, 0, -1, 2, -1, 0, 0, 0);
	const cv::Mat ykernal = (cv::Mat_<float>(3, 3) << 0, -1, 0, 0, 2, 0, 0, -1, 0);
	for (int i = 0; i < level - 1; i++)
	{
		cv::pyrDown(currentImg, downImg);
		tempImg = sml(currentImg, xkernal, ykernal);
		output.push_back(tempImg);
		currentImg = downImg.clone();
	}
	output.push_back(currentImg);
	return output;
}

// 高斯金字塔
std::vector<cv::Mat> gaussianPyramid(const cv::Mat & img, int level)
{
	std::vector<cv::Mat> output;
	output.push_back(img);
	cv::Mat curImg = img, tmp;
	for (int i = 1; i < level; i++)
	{
		cv::pyrDown(curImg, tmp);
		output.push_back(tmp);
		curImg = tmp;
	}
	return output;
}

// 拉普拉斯金字塔
std::vector<cv::Mat> laplacianPyramid(cv::Mat & img, int level)
{
	std::vector<cv::Mat> output;
	cv::Mat currentImg = img.clone(), downImg, upImg, tempImg;
	//cv::Mat currentImg = img, downImg, upImg, tempImg;
	for (int i = 0; i < level; i++)
	{
		cv::pyrDown(currentImg, downImg);
		cv::pyrUp(downImg, upImg, currentImg.size());
		tempImg = currentImg - upImg;
		if (i < level - 1)
			output.push_back(tempImg);
		else
			output.push_back(currentImg);
		currentImg = downImg.clone();
	}
	return output;
}

// 加权金字塔
std::vector<cv::Mat> weightedPyramid(const cv::Mat & img, int level)
{
	std::vector<cv::Mat> AddPyradmin(level), smlPyr, depthPyr, HSV, TEM;
	cv::Mat pic, sparseMap, depthMap, temp, I;
	img.convertTo(I, CV_32F, 1.0 / 255);
	cv::cvtColor(I, pic, CV_RGB2HSV);
	cv::split(pic, HSV);
	smlPyr = SMLPyramid(HSV[2], level);
	const cv::Mat xkernal = (cv::Mat_<float>(3, 3) << 0, 0, 0, -1, 2, -1, 0, 0, 0);
	const cv::Mat ykernal = (cv::Mat_<float>(3, 3) << 0, -1, 0, 0, 2, 0, 0, -1, 0);
	sparseMap = sml(HSV[1], xkernal, ykernal);
	cv::threshold(HSV[1], temp, 0, 1.0, cv::THRESH_BINARY);
	sparseMap += smlPyr[0].mul(1 - temp);
	cv::ximgproc::guidedFilter(HSV[2], sparseMap, depthMap, 15, 10e-4f);
	depthPyr = gaussianPyramid(depthMap, level);
	for (int i = 0; i < level; i++)
	{
		AddPyradmin[i] = smlPyr[i].mul(depthPyr[i]);
	}
	return AddPyradmin;
}

void Index(const std::vector<cv::Mat>& input, cv::Mat & output)
{
	const int size = input.size(), row = input[0].rows, col = input[0].cols;
	std::vector<float> number(size);
	output = cv::Mat::zeros(input[0].size(), CV_8U);
	for (size_t i = 0; i < row; i++)
	{
		for (size_t j = 0; j < col; j++)
		{
			for (size_t n = 0; n < size; n++)
			{
				number[n] = input[n].ptr<float>(i)[j];
			}
			size_t index = argmax(number.begin(), number.end());
			output.ptr<char>(i)[j] = (int)(index);
		}
	}
}


// enable multiple procese handler
DWORD WINAPI ThreadProc(LPVOID p)
{
	ThreadData* data = static_cast<ThreadData*>(p);
	data->func(data);
	return 0;
}

// multiple process handler - laplacian
void laplacianPyramidHandler(ThreadData* data)
{
	auto start = std::chrono::system_clock::now();
	cv::Mat pic;
	for (int i = 0; i < data->level; i++)
	{
		data->imgs[i].convertTo(pic, CV_32F);
		data->result->push_back(laplacianPyramid(pic, data->level));
		std::cout << "laplacian push_back" << std::endl;
	}
	auto end = std::chrono::system_clock::now();
	auto duration = std::chrono::duration_cast<std::chrono::milliseconds>(end - start).count();
	std::cout << "laplacianPyramidHandler duration: " << duration << " microseconds" << std::endl;
}

// multiple process handler - addweight
void addweightPyramidHandler(ThreadData* data)
{
	auto start = std::chrono::system_clock::now();
	for (int i = 0; i < data->level; i++)
	{
		data->result->push_back(weightedPyramid(data->imgs[i], data->level));
		std::cout << "addweight push_back" << std::endl;
	}
	auto end = std::chrono::system_clock::now();
	auto duration = std::chrono::duration_cast<std::chrono::milliseconds>(end - start).count();
	std::cout << "addweightPyramidHandler duration: " << duration << " microseconds" << std::endl;
}

cv::Mat fucusedSynthesis(std::vector <cv::Mat> imgs)
{
	auto start = std::chrono::high_resolution_clock::now();
	int level = imgs.size();
	int n;
	cv::Mat pic, mask, res;
	std::vector<cv::Mat> funsionPyramid(level); 
	std::vector<cv::Mat> tempPyramid(level); 
	std::vector<std::vector<cv::Mat>>imgPyramid, addPyramid; 

	// create thread data
	ThreadData laplacianData{ &imgPyramid, imgs, level, laplacianPyramidHandler };
	ThreadData addweightData{ &addPyramid, imgs, level, addweightPyramidHandler };

	// create two thread
	HANDLE hThread1 = CreateThread(NULL, 0, ThreadProc, &laplacianData, 0, NULL);
	HANDLE hThread2 = CreateThread(NULL, 0, ThreadProc, &addweightData, 0, NULL);

	// waiting thread finish handler
	WaitForSingleObject(hThread1, INFINITE);
	WaitForSingleObject(hThread2, INFINITE);

	CloseHandle(hThread1);
	CloseHandle(hThread2);

	//for (int i = 0; i < level; i++)
	//{
	//	imgs[i].convertTo(pic, CV_32F); // 提高计算精度
	//	imgPyramid.push_back(laplacianPyramid(pic, level)); // 存储图像金字塔
	//	addPyramid.push_back(weightedPyramid(imgs[i], level)); // 存储加权图像金字塔
	//}

	auto process_end = std::chrono::high_resolution_clock::now();
	auto process_duration = std::chrono::duration_cast<std::chrono::milliseconds>(process_end - start).count();
	std::cout << "fucusedSynthesis preprocess time: " << process_duration << std::endl;
	funsionPyramid = imgPyramid[0]; // 第一个图像金字塔作为融合结果
	for (int i = 0; i < level; i++)
	{
		auto pyramid = std::chrono::high_resolution_clock::now();
		for (int j = 0; j < level; j++)
		{
			tempPyramid[j] = addPyramid[j][i]; // 取出加权图像金字塔的第i层
		}
		Index(tempPyramid, mask);
		for (size_t p = 0; p < imgPyramid[0][i].rows; p++)
		{
			for (size_t q = 0; q < imgPyramid[0][i].cols; q++)
			{
				n = (int)mask.at<uchar>(p, q);
				funsionPyramid[i].at<cv::Vec3f>(p, q) = imgPyramid[n][i].at<cv::Vec3f>(p, q);
			}
		}
		auto pyramid_end = std::chrono::high_resolution_clock::now();
		auto duration = std::chrono::duration_cast<std::chrono::milliseconds>(pyramid_end - pyramid).count();
		if (duration == 0) continue;
		std::cout << "fucusedSynthesis pyramid No." << i << " time: " << duration << std::endl;
	}
	auto pyramid_finish = std::chrono::high_resolution_clock::now();
	auto pyramid_duration = std::chrono::duration_cast<std::chrono::milliseconds>(pyramid_finish - process_end).count();
	std::cout << "fucusedSynthesis all pyramid finish time: " << pyramid_duration << std::endl;

	res = collapsePyramid(funsionPyramid, level);

	auto collapse_pyramid_finish = std::chrono::high_resolution_clock::now();
	auto collapse_pyramid_duration = std::chrono::duration_cast<std::chrono::milliseconds>(collapse_pyramid_finish - pyramid_finish).count();
	std::cout << "fucusedSynthesis collapse pyramid time: " << collapse_pyramid_duration << std::endl;
	res.convertTo(res, CV_8U);
	auto end = std::chrono::high_resolution_clock::now();
	auto duration = std::chrono::duration_cast<std::chrono::milliseconds>(end - start).count();
	std::cout << "fucusedSynthesis all time: " << duration << std::endl;
	return res;
}
```

```cpp
// depthSynthesis.h
#pragma once
#include <iostream>
#include <opencv2\ximgproc\edge_filter.hpp>
#include <opencv2\imgproc\types_c.h>
#include <opencv2\imgproc\imgproc.hpp>
#include <algorithm>
#include <chrono>
#include <windows.h>

struct ThreadData {
	std::vector<std::vector<cv::Mat>> *result;
	std::vector <cv::Mat> imgs;
	int level;
	void(*func)(ThreadData*);
};

cv::Mat fucusedSynthesis(std::vector <cv::Mat> imgs);
```

## 查找最佳拼接缝

```cpp
void elimaeSeam(Mat &img0, Mat &img1)
{
	cv::Mat mask0 = cv::Mat_<uchar>(img0.size(), 255);
	cv::Mat mask1 = cv::Mat_<uchar>(img1.size(), 255);

	std::vector<cv::UMat>   imgs_warped;
	std::vector<cv::UMat>   masks_warped;
	std::vector<cv::Point>  corners_warped;
	std::vector<cv::Size>   sizes_warped;

	imgs_warped.push_back(img0.getUMat(cv::ACCESS_READ));
	imgs_warped.push_back(img1.getUMat(cv::ACCESS_READ));

	masks_warped.push_back(mask0.getUMat(cv::ACCESS_READ));
	masks_warped.push_back(mask1.getUMat(cv::ACCESS_READ));

	corners_warped.push_back(cv::Point(0, 0));
	corners_warped.push_back(cv::Point(img0.cols * 0.72, 0));

	sizes_warped.push_back(img0.size());
	sizes_warped.push_back(img1.size());

	std::vector<cv::UMat> imgs_warped_f(imgs_warped.size());
	for (unsigned int i = 0; i < imgs_warped.size(); ++i)
		imgs_warped[i].convertTo(imgs_warped_f[i], CV_32F);

	cv::Ptr<cv::detail::SeamFinder> seam_finder;
	seam_finder = cv::makePtr<cv::detail::DpSeamFinder>(cv::detail::DpSeamFinder::COLOR);
	seam_finder->find(imgs_warped_f, corners_warped, masks_warped);

	// 提取每个掩码的缝合线
	for (size_t i = 0; i < masks_warped.size(); ++i) {
		cv::Mat mask;
		masks_warped[i].copyTo(mask);

		cv::Mat img_with_seam;
		cv::cvtColor(imgs_warped[i].getMat(cv::ACCESS_READ), img_with_seam, cv::COLOR_BGR2RGB);

		img_with_seam.setTo(cv::Scalar(0, 255, 0), mask == 0);

		cv::imwrite("seam_line_" + std::to_string(i) + ".jpg", img_with_seam);
	}

	//多频段融合
	cv::Ptr<detail::Blender> blender = cv::makePtr<detail::MultiBandBlender>();
	detail::MultiBandBlender* mblender = dynamic_cast<detail::MultiBandBlender*>(blender.get());
	mblender->setNumBands(5);

	blender->prepare(corners_warped, sizes_warped);

	for (unsigned int i = 0; i < imgs_warped.size(); i++)
	{
		cv::Mat img_warped_s;
		imgs_warped[i].convertTo(img_warped_s, CV_16S);

		cv::Mat mask_warped = masks_warped[i].getMat(cv::ACCESS_READ);
		cv::Mat dilated_mask;
		cv::dilate(mask_warped, dilated_mask, cv::Mat());
		mask_warped = dilated_mask & mask_warped;

		blender->feed(img_warped_s, mask_warped, corners_warped[i]);
	}

	cv::Mat result, result_mask;
	blender->blend(result, result_mask);

	result.convertTo(result, CV_8U);
	imwrite("elimateSeamResult.jpg", result); 
}
```