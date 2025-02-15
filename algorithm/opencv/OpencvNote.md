# Opencv 笔记

注：本笔记的编写采用的是 opencv-v4.10 版本，且主要使用 cpp 来进行实现代码（部分算法可能会考虑使用 python 实现）。

## 1. OpenCV 图片的读取

```cpp
#include <iostream>
#include <opencv2/opencv.hpp>

using namespace cv;

int main()
{
    Mat image = imread("image.jpg", IMREAD_COLOR); // 读取彩色图片
    if (image.empty())
    {
        std::cout << "Could not open or find the image" << std::endl;
        return -1;
    }
    imshow("Display window", image); // 显示图片
    waitKey(0); // 等待按键
    destroyAllWindows(); // 关闭显示窗口
    return 0;
}
```

## 2. 颜色空间

```cpp
#include <iostream>
#include <opencv2/opencv.hpp>

using namespace cv;

void colorSpace(Mat &image)
{
    Mat gray, hsv;
    cvtColor(image, gray, COLOR_BGR2GRAY); // 转换为灰度图
    cvtColor(image, hsv, COLOR_BGR2HSV); // 转换为 HSV 色彩空间
    imshow("Gray image", gray); // 显示灰度图
    imshow("HSV image", hsv); // 显示 HSV 图
    imwrite("gray.jpg", gray); // 保存灰度图
    imwrite("hsv.jpg", hsv); // 保存 HSV 图
}

int main()
{
    Mat image = imread("image.jpg", IMREAD_COLOR); // 读取彩色图片
    if (image.empty())
    {
        std::cout << "Could not open or find the image" << std::endl;
        return -1;
    }
    colorSpace(image); // 调用颜色空间转换函数
    waitKey(0); // 等待按键
    destroyAllWindows(); // 关闭显示窗口
    return 0;
}
```

## 3. 图像的位运算

图像的位运算主要为`bitwise_and、bitwise_or、bitwise_xor、bitwise_not`这四个按位操作函数。

```cpp
void bitwise_and(InputArray src1, InputArray src2,OutputArray dst, InputArray mask=noArray());//dst = src1 & src2
```

```cpp
void bitwise_or(InputArray src1, InputArray src2,OutputArray dst, InputArray mask=noArray());//dst = src1 | src2
```

```cpp
void bitwise_xor(InputArray src1, InputArray src2,OutputArray dst, InputArray mask=noArray());//dst = src1 ^ src2
```

```cpp
void bitwise_not(InputArray src, OutputArray dst,InputArray mask=noArray());//dst = ~src
```

### 图像的 反色/反相/取反 处理

可以通过 bitwise_not 函数进行对图片(当然了无论是灰度图还是彩色图)内的数据进行取反操作，即完成反色的处理效果：

```CPP
void bitwise_not(InputArray src, OutputArray dst,InputArray mask=noArray()); //dst = ~src
```

```cpp
#include <iostream>
#include <opencv2/opencv.hpp>

using namespace cv;

void reverseColor(Mat &image)
{
    Mat reverse;
    bitwise_not(image, reverse); // 反色处理
    imshow("Reverse image", reverse); // 显示反色图
    imwrite("reverse.jpg", reverse); // 保存反色图
}

int main()
{
    Mat image = imread("image.jpg", IMREAD_COLOR); // 读取彩色图片
    if (image.empty())
    {
        std::cout << "Could not open or find the image" << std::endl;
        return -1;
    }

    reverseColor(image); // 调用反色处理函数

    waitKey(0); // 等待按键
    destroyAllWindows(); // 关闭显示窗口
    return 0;
}
```

### 图像的 异或 处理

可以通过 bitwise_xor 函数进行对图片(当然了无论是灰度图还是彩色图)内的数据进行异或操作，即完成图像的 反相 处理效果：

```cpp
void bitwise_xor(InputArray src1, InputArray src2, OutputArray dst,InputArray mask=noArray()); //dst = src1 ^ src2
```

```cpp
#include <iostream>
#include <opencv2/opencv.hpp>

using namespace cv;

void exorImage(Mat &image1, Mat &image2)
{
    Mat exor;
    bitwise_xor(image, image2, exor); // 反相处理
    imshow("exor image", exor); // 显示反相图
    imwrite("exor.jpg", exor); // 保存反相图
}

int main()
{
    Mat image = imread("image.jpg", IMREAD_COLOR); // 读取彩色图片
    if (image.empty())
    {
        std::cout << "Could not open or find the image" << std::endl;
        return -1;
    }
    exorImage(image); // 调用反相处理函数
    waitKey(0); // 等待按键
    destroyAllWindows(); // 关闭显示窗口
    return 0;
}
```

### 图像的 与 处理

可以通过 bitwise_and 函数进行对图片(当然了无论是灰度图还是彩色图)内的数据进行与操作，即完成图像的 取反 处理效果：

```cpp
void bitwise_and(InputArray src1, InputArray src2, OutputArray dst,InputArray mask=noArray()); //dst = src1 & src2
```

```cpp
#include <iostream>
#include <opencv2/opencv.hpp>

using namespace cv;

void andImage(Mat &image1, Mat &image2)
{
    Mat andImg;
    bitwise_and(image1, image2, andImg); // 取反处理
    imshow("and image", andImg); // 显示取反图
    imwrite("and.jpg", andImg); // 保存取反图
}

int main()
{
    Mat image = imread("image.jpg", IMREAD_COLOR); // 读取彩色图片
    if (image.empty())
    {
        std::cout << "Could not open or find the image" << std::endl;
        return -1;
    }
    andImage(image); // 调用取反处理函数
    waitKey(0); // 等待按键
    destroyAllWindows(); // 关闭显示窗口
    return 0;
}
```

### 图像的 或 处理

可以通过 bitwise_or 函数进行对图片(当然了无论是灰度图还是彩色图)内的数据进行或操作，即完成图像的 取反 处理效果：

```cpp
void bitwise_or(InputArray src1, InputArray src2, OutputArray dst,InputArray mask=noArray()); //dst = src1 | src2
```

```cpp
#include <iostream>
#include <opencv2/opencv.hpp>

    using namespace cv;

void orImage(Mat &image1, Mat &image2)
{
    Mat orImg;
    bitwise_or(image1, image2, orImg); // 取反处理
    imshow("or image", orImg); // 显示取反图
    imwrite("or.jpg", orImg); // 保存取反图
}

int main()
{
    Mat image = imread("image.jpg", IMREAD_COLOR); // 读取彩色图片
    if (image.empty())
    {
        std::cout << "Could not open or find the image" << std::endl;
        return -1;
    }
    orImage(image); // 调用取反处理函数
    waitKey(0); // 等待按键
    destroyAllWindows(); // 关闭显示窗口
    return 0;
}
```

## 4. 如何从零创建一幅图像

1. 首先通过 ones 函数创建一个全黑的图像.
2. 然后通过 Scalar 结构体设置颜色.

```cpp
#include <iostream>
#include <opencv2/opencv.hpp>

using namespace cv;
void createMat()
{
	// new blank image
	Mat m3 = Mat::ones(Size(800, 800), CV_8UC3);//八位无符号单通道 800x800
    Mat m3 = Mat::zeros(Size(800, 800), CV_8UC3);//这个函数跟上面类似不过是把初始化改为0而已
	m3 = Scalar(22, 22, 99);//给不同的通道赋值 BGR 等价于给width*height数组内分配一个颜色为22,22,99的像素点
	std::cout << m3.cols << "  " << m3.rows << "  " << m3.channels() << std::endl;
	Mat m4;
	m3.copyTo(m4); // 将m3复制到m4当中
	m4 = Scalar(0, 255, 255); // 设置颜色
	imshow("dfa", m3);
	imshow("dfaa", m4);
}

int main()
{
	createMat();
	waitKey(0);
	destroyAllWindows();
	return 0;
}
```

## 5. 图像的像素操作

### 如何操作图像的像素

```cpp
#include <iostream>
#include <opencv2/opencv.hpp>

using namespace cv;

void pixel_visit_Demo(Mat &image) {
	int w = image.cols;
	int h = image.rows;
	int dims = image.channels();

	for (int row = 0; row < h; row++) {
		for (int col = 0; col < w; col++) {
			if (dims == 1) {// 单通道
				int pv = image.at<uchar>(row, col);
				image.at<uchar>(row, col) = 255 - pv;
			}
			if (dims == 3) {// 三通道
				Vec3b bgr = image.at<Vec3b>(row, col);
				image.at<Vec3b>(row, col) = 255 - bgr[0];
				image.at<Vec3b>(row, col) = 255 - bgr[1];
				image.at<Vec3b>(row, col) = 255 - bgr[2];
			}
		}
	}
	imshow("像素演示", image);
}

int main()
{
    Mat image = imread("image.jpg", IMREAD_COLOR); // 读取彩色图片
    if (image.empty())
    {
        std::cout << "Could not open or find the image" << std::endl;
        return -1;
    }
    pixel_visit_Demo(image); // 调用像素操纵函数
    waitKey(0); // 等待按键
    destroyAllWindows(); // 关闭显示窗口
    return 0;
}
```

### 图像像素的 加、减、乘、除 运算

主要通过如下函数进行像素的加、减、乘、除运算：

```cpp
void add(InputArray src1, InputArray src2, OutputArray dst, InputArray mask=noArray()); //dst = src1 + src2
void subtract(InputArray src1, InputArray src2, OutputArray dst, InputArray mask=noArray()); //dst = src1 - src2
void multiply(InputArray src1, InputArray src2, OutputArray dst, double scale=1, int dtype=-1); //dst = src1 * src2 * scale
void divide(InputArray src1, InputArray src2, OutputArray dst, double scale=1, int dtype=-1); //dst = src1 / src2 / scale
```

测试样例：

```cpp
#include <iostream>
#include <opencv2/opencv.hpp>

using namespace cv;

// 图像像素的运算操作
void QuickDemo::operators_demo(Mat &image) {
	Mat dst = Mat::zeros(image.size(), image.type());
	Mat m = Mat::zeros(image.size(), image.type());
	m = Scalar(20, 2, 2);
	//dst = image - Scalar(50, 50, 50);	// 这样也能进行加减操作，乘除不行 乘除重载的符号对应的运算可能跟你想要的操作不一致，尽量避免
	//dst = image --Scalar(50, 50, 50);

	//add(image, m, dst);
	//subtract(image, m, dst);
	//multiply(image, m, dst);
	divide(image, m, dst);

	imshow("dst", dst);
}

int main()
{
    Mat image = imread("image.jpg", IMREAD_COLOR); // 读取彩色图片
    if (image.empty())
    {
        std::cout << "Could not open or find the image" << std::endl;
        return -1;
    }
    QuickDemo::operators_demo(image); // 调用像素运算函数
    waitKey(0); // 等待按键
    destroyAllWindows(); // 关闭显示窗口
    return 0;
}
```

## 6. 图像的键盘操作

主要是通过 waitKey 函数实现键盘输入的监听。waitkey 完整函数声明：

```cpp
int waitKey(int delay = 0)
```

delay 表示等待时间，单位为毫秒，如果为 0，则表示无限等待。返回的值表示按下的键的 ASCII 码。

```cpp
#include <iostream>
#include <opencv2/opencv.hpp>

using namespace cv;

void keyboard_demo(Mat &image) {
	int key = 0;
	while (key != 27) { // 按下 esc 键退出
		key = waitKey(10); // 等待 10ms
		if (key == 'q') { // 按下 q 键退出
			break;
		}
		if (key == 'a') { // 按下 a 键进行加法操作
			Mat dst = Mat::zeros(image.size(), image.type());
			Mat m = Mat::zeros(image.size(), image.type());
			m = Scalar(20, 2, 2);
			add(image, m, dst);
			imshow("dst", dst);
		}
		if (key == 'd') { // 按下 d 键进行减法操作
			Mat dst = Mat::zeros(image.size(), image.type());
			Mat m = Mat::zeros(image.size(), image.type());
			m = Scalar(20, 2, 2);
			subtract(image, m, dst);
			imshow("dst", dst);
		}
		if (key == 'p') { // 按下 p 键进行乘法操作
			Mat dst = Mat::zeros(image.size(), image.type());
			Mat m = Mat::zeros(image.size(), image.type());
			m = Scalar(20, 2, 2);
			multiply(image, m, dst);
			imshow("dst", dst);
		}
		if (key == 'v') { // 按下 v 键进行除法操作
			Mat dst = Mat::zeros(image.size(), image.type());
			Mat m = Mat::zeros(image.size(), image.type());
			m = Scalar(20, 2, 2);
			divide(image, m, dst);
			imshow("dst", dst);
		}
	}
}

int main()
{
    Mat image = imread("image.jpg", IMREAD_COLOR); // 读取彩色图片
    if (image.empty())
    {
        std::cout << "Could not open or find the image" << std::endl;
        return -1;
    }
    keyboard_demo(image); // 调用键盘操作函数
    waitKey(0); // 等待按键
    destroyAllWindows(); // 关闭显示窗口
    return 0;
}
```


## 7. 图像的颜色提取与转换

主要通过 inRange 函数实现颜色提取与转换。inRange 函数完整函数声明：

```cpp
void inRange(InputArray src, InputArray lowerb, InputArray upperb, OutputArray dst)
// 从src图像中 提取出 位于 lowerb 和 upperb 之间的值，并将其存入 dst 图像中
```

```cpp
#include <iostream>
#include <opencv2/opencv.hpp>

using namespace cv;
// 颜色的提取与转换
void inrange_demo(Mat &image) {
	Mat hsv;
	cvtColor(image, hsv, COLOR_BGR2HSV);
	Mat mask;
	inRange(hsv, Scalar(35, 43, 46), Scalar(77, 255, 255), mask); // 提取出颜色在(35,43,46)到(77,255,255)之间的颜色区域范围 注:这里是BGR

	Mat redback = Mat::zeros(image.size(), image.type());
	redback = Scalar(40, 40, 200);
	bitwise_not(mask, mask);
	image.copyTo(redback, mask);
	imshow("roi", redback);
}

int main()
{
    Mat image = imread("image.jpg", IMREAD_COLOR); // 读取彩色图片
    if (image.empty())
    {
        std::cout << "Could not open or find the image" << std::endl;
        return -1;
    }
    inrange_demo(image); // 调用颜色提取与转换函数
    waitKey(0); // 等待按键
    destroyAllWindows(); // 关闭显示窗口
    return 0;
}
```

## 8. 图像的像素类型转换与归一化

归一化的目标是找到某种映射关系，将原数据映射到[a,b]区间上。一般a,b会取[−1,1],[0,1]这些组合。

主要通过 convertTo、normalize 函数实现像素类型转换与归一化。convertTo 函数完整函数声明：

```cpp
void convertTo(InputArray src, OutputArray dst, int rtype, double alpha=1, double beta=0);
// 将 src 图像转换为 rtype 类型，并将其存入 dst 图像中，alpha 和 beta 是可选参数，用于进行像素值转换

void normalize(InputArray src, OutputArray dst, double alpha=1, double beta=0, int norm_type=NORM_MINMAX, int dtype=-1);
// 将 src 图像进行归一化处理，并将其存入 dst 图像中，alpha 和 beta 是可选参数，用于进行像素值归一化
```

```cpp
#include <iostream>
#include <opencv2/opencv.hpp>

using namespace cv;

// 像素类型转换与归一化
void QuickDemo::norm_demo(Mat &image) {
	Mat dst;
	std::cout << image.type() << std::endl;
	image.convertTo(image, CV_32F); // 将图像原本的CV_8UC3类型转换为CV_32F类型
	std::cout << image.type() << std::endl;
	normalize(image, dst, 1.0, 0, NORM_MINMAX); // 归一化处理 
	std::cout << dst.type() << std::endl;
	imshow("图像数据归一化", dst);
}

int main()
{
    Mat image = imread("image.jpg", IMREAD_COLOR); // 读取彩色图片
    if (image.empty())
    {
        std::cout << "Could not open or find the image" << std::endl;
        return -1;
    }
    QuickDemo::norm_demo(image); // 调用像素类型转换与归一化函数
    waitKey(0); // 等待按键
    destroyAllWindows(); // 关闭显示窗口
    return 0;
}
```

## 9. 图像的几何变换

### 9.1 图像的翻转

主要通过 flip 函数实现图像的翻转。flip 函数完整函数声明：

```cpp
void flip(InputArray src, OutputArray dst, int flipCode);
// 将 src 图像进行 flipCode 方向的翻转，并将其存入 dst 图像中 
// flipCode 的取值如下：
// 0：沿 x 轴翻转
// 1：沿 y 轴翻转
// -1：沿 x 轴和 y 轴翻转
```

测试样例：

```cpp
#include <iostream>
#include <opencv2/opencv.hpp>

using namespace cv;

// 图像翻转
void QuickDemo::flip_demo(Mat &image) {
	Mat dst;
	flip(image, dst, 1);// 0以x为轴镜像，1以y轴镜像，-1以x=y为轴镜像
	imshow("图像翻转", dst);
}

int main()
{
    Mat image = imread("image.jpg", IMREAD_COLOR); // 读取彩色图片
    if (image.empty())
    {
        std::cout << "Could not open or find the image" << std::endl;
        return -1;
    }
    QuickDemo::flip_demo(image); // 调用图像翻转函数
    waitKey(0); // 等待按键
    destroyAllWindows(); // 关闭显示窗口
    return 0;
}
```

### 9.2 图像的旋转

主要通过 getRotationMatrix2D 函数和 warpAffine 函数实现图像的旋转。getRotationMatrix2D 函数完整函数声明：

```cpp
Mat getRotationMatrix2D(Point2f center, double angle, double scale);
// 返回一个 2x3 矩阵，用于进行 2D 仿射变换，以 center 为中心，旋转 angle 度，缩放 scale 倍
```

warpAffine 函数完整函数声明：

```cpp
void warpAffine(InputArray src, OutputArray dst, InputArray M, Size dsize, int flags=INTER_LINEAR, int borderMode=BORDER_CONSTANT, const Scalar& borderValue=Scalar());
// 对 src 图像进行 2D 仿射变换，并将其存入 dst 图像中，M 为 2x3 矩阵，dsize 为目标图像的大小，flags 为插值方法，borderMode 为边界处理方法，borderValue 为边界填充值
```

测试样例：

```cpp
#include <iostream>
#include <opencv2/opencv.hpp>

using namespace cv;

// 图像的旋转
void rotate_demo(Mat &image) {
	Mat M, dst;
	int w = image.cols;
	int h = image.rows;
	M = getRotationMatrix2D(Point2f(w / 2, h / 2), 45, 1.0);
	double cos = abs(M.at<double>(0, 0));
	double sin = abs(M.at<double>(0, 1));
	int nw = w * cos + h * sin;
	int nh = w * sin + h * cos;
	M.at<double>(0, 2) += (nw / 2 - w / 2);
	M.at<double>(1, 2) += (nh / 2 - h / 2);
	warpAffine(image, dst, M, Size(nw, nh), INTER_LINEAR, 0, Scalar(0, 255, 0));
	imshow("旋转", dst);
}
int main()
{
    Mat image = imread("image.jpg", IMREAD_COLOR); // 读取彩色图片
    if (image.empty())
    {
        std::cout << "Could not open or find the image" << std::endl;
        return -1;
    }
    rotate_demo(image); // 调用图像旋转函数
    waitKey(0); // 等待按键
    destroyAllWindows(); // 关闭显示窗口
    return 0;
}
```

## 10. 滤波处理算法

### 10.0 自定义卷积核

可以通过以下的方式来自定义卷积核：

```cpp
Mat kernel = (Mat_<float>(3, 3) << -1, 0, 1, -1, 0, 1, -1, 0, 1);
```

### 10.1 高通滤波

主要是通过 filter2D 函数实现高通滤波。filter2D 函数完整函数声明：

```cpp
void filter2D(InputArray src, OutputArray dst, int ddepth, InputArray kernel, Point anchor=Point(-1,-1), double delta=0, int borderType=BORDER_DEFAULT);
// 对 src 图像进行 2D 卷积，并将其存入 dst 图像中，ddepth 为目标图像的深度，kernel 为卷积核，anchor 为锚点，delta 为偏移量，borderType 为边界处理方法
// 边界处理方法：
// BORDER_DEFAULT：默认方法，当边界处理方法无法处理时，使用 BORDER_REFLECT_101 进行边界处理
// BORDER_REFLECT：沿 x 轴和 y 轴进行反射处理
// BORDER_REFLECT_101：沿 x 轴和 y 轴进行反射处理，边界像素点的颜色值与边界相邻的像素点的颜色值相同
// BORDER_REPLICATE：沿 x 轴和 y 轴进行复制处理
// BORDER_WRAP：沿 x 轴和 y 轴进行重复处理
```

测试样例：

```cpp
#include <iostream>
#include <opencv2/opencv.hpp>

using namespace cv;

// 高通滤波
void filter2D_demo(Mat &image) {
	Mat kernel = (Mat_<float>(3, 3) << 0, -1, 0, -1, 5, -1, 0, -1, 0);
	Mat dst;
	filter2D(image, dst, -1, kernel);
	imshow("滤波图像", dst);
}

int main()
{
    Mat image = imread("image.jpg", IMREAD_COLOR); // 读取彩色图片
    if (image.empty())
    {
        std::cout << "Could not open or find the image" << std::endl;
        return -1;
    }
    filter2D_demo(image); // 调用高通滤波函数
    waitKey(0); // 等待按键
    destroyAllWindows(); // 关闭显示窗口
    return 0;
}
```

### 10.2 低通滤波

主要是通过 filter2D 函数实现低通滤波。filter2D 函数完整函数声明：

```cpp
void filter2D(InputArray src, OutputArray dst, int ddepth, InputArray kernel, Point anchor=Point(-1,-1), double delta=0, int borderType=BORDER_DEFAULT);
// 对 src 图像进行 2D 卷积，并将其存入 dst 图像中，ddepth 为目标图像的深度，kernel 为卷积核，anchor 为锚点，delta 为偏移量，borderType 为边界处理方法
// 边界处理方法：
// BORDER_DEFAULT：默认方法，当边界处理方法无法处理时，使用 BORDER_REFLECT_101 进行边界处理
// BORDER_REFLECT：沿 x 轴和 y 轴进行反射处理
// BORDER_REFLECT_101：沿 x 轴和 y 轴进行反射处理，边界像素点的颜色值与边界相邻的像素点的颜色值相同
// BORDER_REPLICATE：沿 x 轴和 y 轴进行复制处理
// BORDER_WRAP：沿 x 轴和 y 轴进行重复处理
```

测试样例：

```cpp
#include <iostream>
#include <opencv2/opencv.hpp>

using namespace cv;

// 低通滤波
void filter2D_demo(Mat &image) {
	Mat kernel = (Mat_<float>(3, 3) << 0, 1, 0, 1, -4, 1, 0, 1, 0);
	Mat dst;
	filter2D(image, dst, -1, kernel);
	imshow("滤波图像", dst);
}

int main()
{
    Mat image = imread("image.jpg", IMREAD_COLOR); // 读取彩色图片
    if (image.empty())
    {
        std::cout << "Could not open or find the image" << std::endl;
        return -1;
    }
    filter2D_demo(image); // 调用低通滤波函数
    waitKey(0); // 等待按键
    destroyAllWindows(); // 关闭显示窗口
    return 0;
}
```

### 10.3 均值滤波

主要是通过 blur 函数实现均值滤波。blur 函数完整函数声明：

```cpp
void blur(InputArray src, OutputArray dst, Size ksize, Point anchor=Point(-1,-1), int borderType=BORDER_DEFAULT);
// 对 src 图像进行 ksize 大小的均值滤波，并将其存入 dst 图像中，anchor 为锚点，borderType 为边界处理方法
```

测试样例：

```cpp
#include <iostream>
#include <opencv2/opencv.hpp>

using namespace cv;

// 均值滤波
void blur_demo(Mat &image) {
	Mat dst;
	blur(image, dst, Size(3, 3), Point(-1, -1));
	imshow("滤波图像", dst);
}
int main()
{
    Mat image = imread("image.jpg", IMREAD_COLOR); // 读取彩色图片
    if (image.empty())
    {
        std::cout << "Could not open or find the image" << std::endl;
        return -1;
    }
    blur_demo(image); // 调用均值滤波函数
    waitKey(0); // 等待按键
    destroyAllWindows(); // 关闭显示窗口
    return 0;
}
```

### 10.4 中值滤波

主要是通过 medianBlur 函数实现中值滤波。medianBlur 函数完整函数声明：

```cpp
void medianBlur(InputArray src, OutputArray dst, int ksize);
// 对 src 图像进行 ksize 大小的中值滤波，并将其存入 dst 图像中
```

测试样例：

```cpp
#include <iostream>
#include <opencv2/opencv.hpp>

using namespace cv;

// 中值滤波
void medianBlur_demo(Mat &image) {
	Mat dst;
	medianBlur(image, dst, 3);
	imshow("滤波图像", dst);
}

int main()
{
    Mat image = imread("image.jpg", IMREAD_COLOR); // 读取彩色图片
    if (image.empty())
    {
        std::cout << "Could not open or find the image" << std::endl;
        return -1;
    }
    medianBlur_demo(image); // 调用中值滤波函数
    waitKey(0); // 等待按键
    destroyAllWindows(); // 关闭显示窗口
    return 0;
}
```

### 10.5 高斯滤波

主要是通过 GaussianBlur 函数实现高斯滤波。GaussianBlur 函数完整函数声明：

```cpp
void GaussianBlur(InputArray src, OutputArray dst, Size ksize, double sigmaX, double sigmaY=0, int borderType=BORDER_DEFAULT);
// 对 src 图像进行 ksize 大小的高斯滤波，并将其存入 dst 图像中，sigmaX 和 sigmaY 为高斯函数的标准差，borderType 为边界处理方法
// 边界处理方法：
// BORDER_DEFAULT：默认方法，当边界处理方法无法处理时，使用 BORDER_REFLECT_101 进行边界处理
// BORDER_REFLECT：沿 x 轴和 y 轴进行反射处理
// BORDER_REFLECT_101：沿 x 轴和 y 轴进行反射处理，边界像素点的颜色值与边界相邻的像素点的颜色值相同
// BORDER_REPLICATE：沿 x 轴和 y 轴进行复制处理
// BORDER_WRAP：沿 x 轴和 y 轴进行重复处理
```
测试样例：

```cpp
#include <iostream>
#include <opencv2/opencv.hpp>

using namespace cv;

// 高斯滤波
void GaussianBlur_demo(Mat &image) {
	Mat dst;
	GaussianBlur(image, dst, Size(3, 3), 0, 0);
	imshow("滤波图像", dst);
}

int main()
{
    Mat image = imread("image.jpg", IMREAD_COLOR); // 读取彩色图片
    if (image.empty())
    {
        std::cout << "Could not open or find the image" << std::endl;
        return -1;
    }
    GaussianBlur_demo(image); // 调用高斯滤波函数
    waitKey(0); // 等待按键
    destroyAllWindows(); // 关闭显示窗口
    return 0;
}
```

### 10.6 双边滤波

主要是通过 bilateralFilter 函数实现双边滤波。bilateralFilter 函数完整函数声明：

```cpp
void bilateralFilter(InputArray src, OutputArray dst, int d, double sigmaColor, double sigmaSpace, int borderType=BORDER_DEFAULT);
// 对 src 图像进行双边滤波，并将其存入 dst 图像中，d 为领域半径，sigmaColor 为颜色空间的标准差，sigmaSpace 为坐标空间的标准差，borderType 为边界处理方法
// 边界处理方法：
// BORDER_DEFAULT：默认方法，当边界处理方法无法处理时，使用 BORDER_REFLECT_101 进行边界处理
// BORDER_REFLECT：沿 x 轴和 y 轴进行反射处理
// BORDER_REFLECT_101：沿 x 轴和 y 轴进行反射处理，边界像素点的颜色值与边界相邻的像素点的颜色值相同
// BORDER_REPLICATE：沿 x 轴和 y 轴进行复制处理
```

测试样例：

```cpp
#include <iostream>
#include <opencv2/opencv.hpp>
using namespace cv;
// 双边滤波
void bilateralFilter_demo(Mat &image) {
	Mat dst;
	bilateralFilter(image, dst, 9, 75, 75);
	imshow("滤波图像", dst);
}

int main()
{
    Mat image = imread("image.jpg", IMREAD_COLOR); // 读取彩色图片
    if (image.empty())
    {
        std::cout << "Could not open or find the image" << std::endl;
        return -1;
    }
    bilateralFilter_demo(image); // 调用双边滤波函数
    waitKey(0); // 等待按键
    destroyAllWindows(); // 关闭显示窗口
    return 0;
}
```

## 11. 图像的梯度

图像梯度计算的是图像变化的速度。对于图像的边缘部分，其灰度值变化较大，梯度值也较大；相反，对于图像中比较平滑的部分，其灰度值变化较小，相应的梯度值也较小。一般情况下，图像梯度计算的是图像的边缘信息。
本章主要关注 Sobel\Scharr\Laplacian 算子的实现。

### 11.1 图像卷积运算基础

假设图像A
[
    1, 2, 3, 3,
    2, 1, 0, 1,
    3, 0, 1, 2,
    3, 1, 2, 1
]

卷积核
[
    1, 0, 2,
    2, 1, 0,
    2, 0, 1,
]

卷积运算其实就是将图像A与卷积核进行乘积运算，得到的结果称为卷积结果。
那么按照上面的例子，得到的卷积结果为：
[
    19, 10,
    11, 8,
]

从上述运算可知，如果直接进行卷积运算，得到的运算结果与原始图像大小是不一致的。

有时，我们希望通过卷积运算得到图像的某些特征信息，比如图像边缘等。这种情况下，我们希望得到的处理结果与原始图像大小保持一致。此时，我们就需要使用对原始图像填充边界的方式来完成“扩边”​，然后再让其进行卷积，以保证能够得到与原始图像一样大小的处理结果。

所以，在进行卷积运算之前，我们需要对原始图像进行扩边操作。(opencv自动完成扩边操作，这里仅讲诉最初的原理)
扩边后的图像A
[
    0, 0, 0, 0, 0, 0,
    0, 1, 2, 3, 3, 0,
    0, 2, 1, 0, 1, 0,
    0, 3, 0, 1, 0, 0,
    0, 0, 2, 3, 0, 0,
    0, 0, 0, 0, 0, 0,
]

卷积核
[
    1, 0, -1,
    2, 0, -2,
    1, 0, -1,
]

扩边卷积运算后的结果为：
[
    2, 8, 10, 9,
    6, 19, 10, 6,
    7, 11, 8, 8,
    0, 7, 7, 7,
]

那么新的、扩边后的结果跟最初的图像大小就保持一致了。

### 11.2 Sobel 算子

Sobel 算子主要为:
[
    -1, 0, 1,
    -2, 0, 2,
    -1, 0, 1
]
和
[
    -1, -2, -1,
    0, 0, 0, 
    1, 2, 1,
]

在Cpp中，可以用函数 cv::Sobel() 来实现, 其函数定义为:

```cpp
CV_EXPORTS_W void Sobel(InputArray src, OutputArray dst, int ddepth, int dx, int dy, int ksize = 3,double scale = 1, double delta = 0,int borderType = BORDER_DEFAULT);
```

Sobel 算子样例程序如下，计算x方向边缘(梯度): dx=1, dy=0; 计算y方向边缘(梯度): dx=0, dy=1; 组合计算（同时满足x和y方向的边缘）: dx=1, dy=1; 叠加计算(分别计算x和y方向然后再相加操作)

```cpp
#include <opencv2/opencv.hpp>
#include <iostream>
using namespace cv;
using namespace std;
int main(int argc, char** argv)
{
    Mat image = imread("image.jpg", IMREAD_COLOR);
    // Sobel算子的垂直和水平卷积核
    Mat grad_x, grad_y;
    Mat abs_grad_x, abs_grad_y;
    // 计算X方向上的梯度
    Sobel(image, grad_x, CV_16S, 1, 0, 3, 1, 0, BORDER_DEFAULT);
    // 计算Y方向上的梯度
    Sobel(image, grad_y, CV_16S, 0, 1, 3, 1, 0, BORDER_DEFAULT);
    // 计算绝对值
    convertScaleAbs(grad_x, abs_grad_x);
    convertScaleAbs(grad_y, abs_grad_y);
    // 合并梯度
    Mat grad;
    addWeighted(abs_grad_x, 0.5, abs_grad_y, 0.5, 0, grad);
    // 显示结果
    imshow("Original Image", image);
    imshow("Sobel Edge Detection", grad);
    waitKey(0);
    destroyAllWindows();
    return 0;
}
```

### 11.3 Scharr 算子

Scharr 算子主要为:
[
    -3, 0, 3,
    -10, 0, 10,
    -3, 0, 3,
]
和
[
    -3, -10, -3,
    0, 0, 0, 
    3, 10, 3,
]

在Cpp中，可以用函数 cv::Scharr() 来实现, 其函数定义为:

```cpp
CV_EXPORTS_W void Scharr(InputArray src, OutputArray dst, int ddepth, int dx, int dy, double scale = 1, double delta = 0, int borderType = BORDER_DEFAULT);
```

Scharr 算子样例程序如下，【跟Sobel算子类似，只是卷积核不同】计算x方向边缘(梯度): dx=1, dy=0; 计算y方向边缘(梯度): dx=0, dy=1; 叠加计算(分别计算x和y方向然后再相加操作)

```cpp
#include <opencv2/opencv.hpp>
#include <iostream>
using namespace cv;
using namespace std;
int main(int argc, char** argv)
{
    // 读取图像
    Mat image = imread("image.jpg", IMREAD_COLOR);
    // Scharr算子的垂直和水平卷积核
    Mat grad_x, grad_y;
    Mat abs_grad_x, abs_grad_y;
    // 计算X方向上的梯度
    Scharr(image, grad_x, CV_16S, 1, 0, 1, 0, BORDER_DEFAULT);
    // 计算Y方向上的梯度
    Scharr(image, grad_y, CV_16S, 0, 1, 1, 0, BORDER_DEFAULT);
    // 计算绝对值
    convertScaleAbs(grad_x, abs_grad_x);
    convertScaleAbs(grad_y, abs_grad_y);
    // 合并梯度
    Mat grad;
    addWeighted(abs_grad_x, 0.5, abs_grad_y, 0.5, 0, grad);
    imshow("Original Image", image);
    imshow("Scharr Edge Detection", grad);
    waitKey(0);
    destroyAllWindows();
    return 0;
}
```

### Sobel算子与Scharr算子的区别

Sobel算子的缺点是，当其核结构较小时，精确度不高，而Scharr算子具有更高的精度。

### 11.4 Laplacian 算子

Laplacian（拉普拉斯）算子是一种二阶导数算子（分别对x、y方向进行二次求导），其具有旋转不变性，可以满足不同方向的图像边缘锐化（边缘检测）的要求。Laplacian 算子主要为:
[
    0, 1, 0,
    1, -4, 1,
    0, 1, 0,
]

在cpp中，可以用函数 cv::Laplacian() 来实现, 其函数定义为:

```cpp
CV_EXPORTS_W void Laplacian(InputArray src, OutputArray dst, int ddepth, int ksize = 1, double scale = 1, double delta = 0, int borderType = BORDER_DEFAULT);
```

Laplacian 算子样例程序如下。

```cpp
#include <opencv2/opencv.hpp>
#include <iostream>
using namespace cv;
using namespace std;
int main(int argc, char** argv)
{
    // 读取图像
    Mat image = imread("image.jpg", IMREAD_COLOR);
    // Laplacian算子的参数
    Mat laplacian;
    int ddepth = CV_16S; // 输出图像的深度
    int ksize = 3;       // 核大小，必须是正的奇数
    // 计算Laplacian边缘
    Laplacian(image, laplacian, ddepth, ksize, 1, 0, BORDER_DEFAULT);
    // 计算绝对值
    Mat abs_laplacian;
    convertScaleAbs(laplacian, abs_laplacian);
    // 显示结果
    imshow("Original Image", image);
    imshow("Laplacian Edge Detection", abs_laplacian);
    waitKey(0);
    destroyAllWindows();
    return 0;
}
```

### 11.5 LoG 算子

LoG (Laplace of Gaussian) 即对图像先作一边高斯平滑，然后再将平滑后的图像进行Laplacian算子的计算。

LoG样例如下：

```cpp
#include <opencv2/opencv.hpp>
#include <iostream>
using namespace cv;
using namespace std;
int main(int argc, char** argv)
{
    // 读取图像
    Mat image = imread("image.jpg", IMREAD_COLOR);
    // 高斯平滑
    Mat smooth;
    GaussianBlur(image, smooth, Size(3, 3), 0, 0);
    // Laplacian算子的参数
    Mat laplacian;
    int ddepth = CV_16S; // 输出图像的深度
    int ksize = 3;       // 核大小，必须是正的奇数
    // 计算Laplacian边缘 使用smooth图像进行计算
    Laplacian(smooth, laplacian, ddepth, ksize, 1, 0, BORDER_DEFAULT);
    // 计算绝对值
    Mat abs_laplacian;
    convertScaleAbs(laplacian, abs_laplacian);
    // 显示结果
    imshow("Original Image", smooth);
    imshow("Laplacian Edge Detection", abs_laplacian);
    waitKey(0);
    destroyAllWindows();
    return 0;
}
```

### 11.6 Roberts 算子

Roberts 算子是一种对角线方向的边缘检测算子，其核结构如下：
[
    -1, 0,
    0, 1,
]
和
[
    0, -1,
    1, 0,
]

Roberts 样例程序：

```cpp
#include <opencv2/opencv.hpp>
#include <iostream>
using namespace cv;
using namespace std;
int main()
{
    // 读取图像
    Mat image = imread("image.jpg", IMREAD_COLOR);
    // 创建Roberts算子核
    Mat kernelx = (Mat_<float>(2, 2) << -1, 0, 0, 1);
    Mat kernely = (Mat_<float>(2, 2) << 0, -1, 1, 0);
    // 计算X方向上的梯度
    Mat grad_x, grad_y;
    filter2D(image, grad_x, CV_32F, kernelx);
    filter2D(image, grad_y, CV_32F, kernely);
    Mat grad, abs_grad_x, abs_grad_y;
	// 计算绝对值
	convertScaleAbs(grad_x, abs_grad_x);
	convertScaleAbs(grad_y, abs_grad_y);
    // 合并梯度
	addWeighted(abs_grad_x, 0.5, abs_grad_y, 0.5, 0, grad);
    // 显示结果
    imshow("Original Image", image);
    imshow("Roberts Edge Detection", grad);
    waitKey(0);
    destroyAllWindows();
    return 0;
}
```

### 11.7 Kirsch 算子

Kirsch 算子是一种基于八个方向的边缘检测算子, 然后取其最大值作为最终的边缘响应，其核结构如下：
[
    5, 5, 5,
    -3, 0, -3,
    -3, -3, -3,
],
[
    -3, 5, 5,
    -3, 0, 5,
    -3, -3, -3,
],
[
    -3, -3, 5,
    -3, 0, 5,
    -3, -3, 5,
],
[
    -3, -3, -3,
    -3, 0, 5,
    -3, 5, 5,
],
[
    -3, -3, -3,
    -3, 0, -3,
    5, 5, 5,
],
[
    -3, -3, -3,
    5, 0, -3,
    5, 5, -3,
],
[
    5, -3, -3,
    5, 0, -3,
    5, -3, -3,
],
[
    5, 5, -3,
    5, 0, -3,
    -3, -3, -3,
]

Kirsch 样例程序：

```cpp
#include <opencv2/opencv.hpp>
#include <iostream>
using namespace cv;
using namespace std;
int main()
{
    // 读取图像
    Mat image = imread("image.jpg", IMREAD_COLOR);
    // 创建Kirsch算子核
	Mat kernel1 = (Mat_<float>(3, 3) << 5, 5, 5, -3, 0, -3, -3, -3, -3);
	Mat kernel2 = (Mat_<float>(3, 3) << -3, 5, 5, -3, 0, 5, -3, -3, -3);
	Mat kernel3 = (Mat_<float>(3, 3) << -3, -3, 5, -3, 0, 5, -3, -3, 5);
	Mat kernel4 = (Mat_<float>(3, 3) << -3, -3, -3, -3, 0, 5, -3, 5, 5);
	Mat kernel5 = (Mat_<float>(3, 3) << -3, -3, -3, -3, 0, -3, 5, 5, 5);
	Mat kernel6 = (Mat_<float>(3, 3) << -3, -3, -3, 5, 0, -3, 5, 5, -3);
	Mat kernel7 = (Mat_<float>(3, 3) << 5, -3, -3, 5, 0, -3, 5, -3, -3);
	Mat kernel8 = (Mat_<float>(3, 3) << 5, 5, -3, 5, 0, -3, -3, -3, -3);
    // 计算Kirsch边缘
    Mat grad1, grad2, grad3, grad4, grad5, grad6, grad7, grad8, abs_grad;
    filter2D(image, grad1, CV_32F, kernel1);
    filter2D(image, grad2, CV_32F, kernel2);
    filter2D(image, grad3, CV_32F, kernel3);
    filter2D(image, grad4, CV_32F, kernel4);
    filter2D(image, grad5, CV_32F, kernel5);
    filter2D(image, grad6, CV_32F, kernel6);
    filter2D(image, grad7, CV_32F, kernel7);
    filter2D(image, grad8, CV_32F, kernel8);
    // 比较梯度值，取最大值作为最终的边缘响应
    Mat grad;
    max(grad1, grad2, grad);
    max(grad, grad3, grad);
    max(grad, grad4, grad);
    max(grad, grad5, grad);
    max(grad, grad6, grad);
    max(grad, grad7, grad);
    max(grad, grad8, grad);
    // 计算绝对值
    convertScaleAbs(grad, abs_grad);

    // 显示结果
    imshow("Original Image", image);
    imshow("Kirsch Edge Detection", abs_grad);
    waitKey(0);
    destroyAllWindows();
    return 0;
}
```


### 11.8 Prewitt 算子

Prewitt 算子跟Sobel算子类似，但是其卷积核不一样而已，其核结构如下：
[
    -1, 0, 1,
    -1, 0, 1,
    -1, 0, 1,
]
和
[
    -1, -1, -1,
    0, 0, 0,
    1, 1, 1,
]

Prewitt 样例程序：

```cpp
#include <opencv2/opencv.hpp>
#include <iostream>
using namespace cv;
using namespace std;
int main()
{
    // 读取图像
    Mat image = imread("image.jpg", IMREAD_COLOR);
    // 创建Prewitt算子核
    Mat kernelx = (Mat_<float>(3, 3) << -1, 0, 1, -1, 0, 1, -1, 0, 1);
    Mat kernely = (Mat_<float>(3, 3) << -1, -1, -1, 0, 0, 0, 1, 1, 1);
    // 计算X方向上的梯度
    Mat grad_x, grad_y;
    filter2D(image, grad_x, CV_32F, kernelx);
    filter2D(image, grad_y, CV_32F, kernely);
    Mat grad, abs_grad_x, abs_grad_y;
	// 计算绝对值
	convertScaleAbs(grad_x, abs_grad_x);
	convertScaleAbs(grad_y, abs_grad_y);
    // 合并梯度
	addWeighted(abs_grad_x, 0.5, abs_grad_y, 0.5, 0, grad);
    // 显示结果
    imshow("Original Image", image);
    imshow("Prewitt Edge Detection", grad);
    waitKey(0);
    destroyAllWindows();
    return 0;
}
```

## 12. Canny 边缘检测算法

Canny边缘检测原理分为以下几个步骤:
1. 去噪
2. 计算梯度的幅度和方向(sobel来计算)
3. 非极大值抑制
4. 确定边缘，使用双阈值算法确定最终边缘信息

然而在Opencv中，已经提供了Canny边缘检测算法，可以直接使用。

Canny 边缘检测算法的函数定义为:

```cpp
CV_EXPORTS_W void Canny(InputArray image, OutputArray edges, double threshold1, double threshold2, int apertureSize = 3, bool L2gradient = false);
```

Canny 边缘检测算法的样例程序如下:

```cpp
#include <opencv2/opencv.hpp>
#include <iostream>
using namespace cv;
using namespace std;
int main()
{
    // 读取图像
    Mat image = imread("image.jpg", IMREAD_COLOR);
    // 计算边缘
    Mat edges;
    Canny(image, edges, 50, 150);
    // 显示结果
    imshow("Original Image", image);
    imshow("Canny Edge Detection", edges);
    waitKey(0);
    destroyAllWindows();
    return 0;
}
```

## 13. 二值化

图像的二值化，就是将图像中的像素值转换为0或255，从而将图像转换为黑白两色。

### 13.1 全局阈值二值化

全局阈值二值化是将整个图像的像素值根据一个固定的阈值进行转换。如果像素值大于该阈值，则将其设置为255（白色）；否则设置为0（黑色）。这种方法简单且适用于图像整体亮度变化不大的情况。目前主流的全局阈值二值化操作为OTSU法。

全局阈值二值化的函数定义为:
thresh：阈值
maxval：最大值
type：阈值类型 (THRESH_BINARY 或 THRESH_BINARY_INV)

```cpp
CV_EXPORTS_W void threshold(InputArray src, OutputArray dst, double thresh, double maxval, int type);
```

全局阈值二值化的样例程序如下:

```cpp
#include <opencv2/opencv.hpp>
#include <iostream>
using namespace cv;
using namespace std;
int main()
{
    // 读取图像
    Mat image = imread("image.jpg", IMREAD_COLOR);
    // 全局阈值二值化 OTSU
    cvtColor(image, image, COLOR_BGR2GRAY);
    Mat binary;
    int thresholdVal = 200; // 超过这个阈值会将像素设置为255为白色
    threshold(image, binary, 0, thresholdVal, THRESH_BINARY | THRESH_OTSU);
    // 显示结果
    imshow("Original Image", image);
    imshow("Binary Image", binary);
    waitKey(0);
    destroyAllWindows();
    return 0;
}
```

### 13.2 局部阈值二值化

局部阈值二值化是将图像中的每个像素根据邻域内的像素值进行阈值化。这种方法可以有效地去除图像中的噪声，同时保留图像中的边缘信息。

局部阈值二值化的函数定义为:

```cpp
CV_EXPORTS_W void adaptiveThreshold(InputArray src, OutputArray dst, double maxValue, int adaptiveMethod, int thresholdType, int blockSize, double C);
```
maxValue：最大值 
adaptiveMethod：自适应阈值方法 (ADAPTIVE_THRESH_MEAN_C 或 ADAPTIVE_THRESH_GAUSSIAN_C)
thresholdType：阈值类型 (THRESH_BINARY 或 THRESH_BINARY_INV)
blockSize：用于计算像素阈值的像素邻域的大小
C：常数值 从每个邻域计算出的平均值或高斯加权平均值中减去的常量

```cpp
#include <opencv2/opencv.hpp>
#include <iostream>
using namespace cv;
using namespace std;
int main()
{
    // 读取图像
    Mat image = imread("image.jpg", IMREAD_COLOR);
    // 局部阈值二值化
    cvtColor(image, image, COLOR_BGR2GRAY);
    Mat binary;
    int blockSize = 15; // 邻域大小
    double C = 10; // 常数值
    // ADAPTIVE_THRESH_GAUSSIAN_C 高斯加权平均值 ADAPTIVE_THRESH_MEAN_C 平均值
    adaptiveThreshold(image, binary, 255, ADAPTIVE_THRESH_GAUSSIAN_C, THRESH_BINARY, blockSize, C);
    // 显示结果
    imshow("Original Image", image);
    imshow("Binary Image", binary);
    waitKey(0);
    destroyAllWindows();
    return 0;
}
```

## 14. 形态学

### 14.0 自定义卷积核

除了第`## 10 滤波处理` 章节的自定义卷积核，还可以通过 opencv 自带的函数来自定义卷积核。

```cpp
CV_EXPORTS_W Mat getStructuringElement(int shape, Size ksize, Point anchor = Point(-1,-1));
// shape：形状 MORPH_RECT形态学矩形 MORPH_CROSS形态学十字形 MORPH_ELLIPSE形态学椭圆
// ksize：卷积核大小
// anchor：锚点 默认为(-1,-1)
```

举例创建一个7*7*1的卷积核： `Mat kernel = getStructuringElement(CV_SHAPE_RECT, Size(7,7), Point(-1,-1));`

### 14.1 腐蚀

腐蚀是最基本的形态学操作之一，它能够将图像的边界点消除，使图像沿着边界向内收缩，也可以将小于指定结构体元素的部分去除。

#### 腐蚀原理

有一个卷积核为：
[
    1,
    1,
    1,
]

当这个卷积核进行对图像做卷积的时候，有一个前提条件，**当卷积核扫过的图像满足于卷积核这个特征时，才会把这个卷积核的中心的那个像素点设置为 1**，其余都设置为 0，即完成腐蚀操作。

在opencv中，使用函数 `erode` 实现图像的腐蚀操作。其函数定义为

```cpp
CV_EXPORTS_W void erode(InputArray src, OutputArray dst, InputArray kernel, Point anchor = Point(-1,-1), int iterations = 1, int borderType = BORDER_CONSTANT, const Scalar& borderValue = morphologyDefaultBorderValue());
// kernel：卷积核
// anchor：锚点 默认为(-1,-1)
// iterations：腐蚀操作迭代次数 默认为1
// borderType：边界类型 一般采用默认值
// borderValue：边界值 一般采用默认值
```

腐蚀的样例程序如下:

```cpp
#include <opencv2/opencv.hpp>
#include <iostream>
using namespace cv;
using namespace std;
int main()
{
    // 读取图像
    Mat image = imread("image.jpg", IMREAD_COLOR);
    // 腐蚀操作
    Mat kernel = getStructuringElement(CV_SHAPE_RECT, Size(5,5), Point(-1,-1));
    Mat eroded;
    erode(image, eroded, kernel);
    // 显示结果
    imshow("Original Image", image);
    imshow("Eroded Image", eroded);
    waitKey(0);
    destroyAllWindows();
}
```

### 14.2 膨胀

膨胀操作和腐蚀操作的作用是相反的，膨胀操作能对图像的边界进行扩张。

#### 膨胀原理

有一个卷积核为：
[
    1,
    1,
    1,
]

当这个卷积核进行对图像做卷积的时候，有一个前提条件，当卷积核中心扫过的图像满足于卷积核中心这个特征时，才会把这个卷积核的除中心像素点的其余像素点设置为 1

在opencv中，使用函数 `dilate` 实现图像的膨胀操作。其函数定义为

```cpp
CV_EXPORTS_W void dilate(InputArray src, OutputArray dst, InputArray kernel, Point anchor = Point(-1,-1), int iterations = 1, int borderType = BORDER_CONSTANT, const Scalar& borderValue = morphologyDefaultBorderValue());
// kernel：卷积核
// anchor：锚点 默认为(-1,-1)
// iterations：膨胀操作迭代次数 默认为1
// borderType：边界类型 一般采用默认值
// borderValue：边界值 一般采用默认值
```

膨胀的样例程序如下:

```cpp
#include <opencv2/opencv.hpp>
#include <iostream>
using namespace cv;
using namespace std;
int main()
{
    // 读取图像
    Mat image = imread("image.jpg", IMREAD_COLOR);
    // 膨胀操作
    Mat kernel = getStructuringElement(CV_SHAPE_RECT, Size(5,5), Point(-1,-1));
    Mat dilated;
    dilate(image, dilated, kernel);
    // 显示结果
    imshow("Original Image", image);
    imshow("Dilated Image", dilated);
    waitKey(0);
    destroyAllWindows();
}
```

### 14.3 通用形态学函数

腐蚀操作和膨胀操作是形态学运算的基础，将腐蚀和膨胀操作进行组合，就可以实现开运算、闭运算（关运算）​、形态学梯度(Morphological Gradient)运算、礼帽运算（顶帽运算）​、黑帽运算、击中击不中等多种不同形式的运算。
在 opencv 中，提供了 `morphologyEx` 函数来实现上诉所提到的形态学操作。其函数定义为

```cpp
CV_EXPORTS_W void morphologyEx(InputArray src, OutputArray dst, int op, InputArray kernel, Point anchor = Point(-1,-1), int iterations = 1, int borderType = BORDER_CONSTANT, const Scalar& borderValue = morphologyDefaultBorderValue());
// op：形态学操作类型[MORPH_ERODE,MORPH_DILATE,MORPH_OPEN,MORPH_CLOSE,MORPH_GRADIENT,MORPH_TOPHAT,MORPH_BLACKHAT,MORPH_HITMISS] => [腐蚀，膨胀，开运算，闭运算，形态学梯度，顶帽，黑帽，击中与不击中]
// kernel：卷积核
// anchor：锚点 默认为(-1,-1)
// iterations：操作迭代次数 默认为1
// borderType：边界类型 一般采用默认值
// borderValue：边界值 一般采用默认值
```

### 14.3 开运算

开运算进行的操作是先将图像腐蚀，再对腐蚀的结果进行膨胀。开运算可以用于去噪、计数等。

样例程序如下:

```cpp
#include <opencv2/opencv.hpp>
#include <iostream>
using namespace cv;
using namespace std;
int main()
{
    // 读取图像
    Mat image = imread("image.jpg", IMREAD_COLOR);
    // 开运算
    Mat kernel = getStructuringElement(MORPH_RECT, Size(5,5), Point(-1,-1));
    Mat opened;
    morphologyEx(image, opened, MORPH_OPEN, kernel);
    // 显示结果
    imshow("Original Image", image);
    imshow("Opened Image", opened);
    waitKey(0);
    destroyAllWindows();
}
```

### 14.4 闭运算

闭运算是先膨胀、后腐蚀的运算，它有助于关闭前景物体内部的小孔，或去除物体上的小黑点，还可以将不同的前景图像进行连接。

样例程序如下:

```cpp
#include <opencv2/opencv.hpp>
#include <iostream>
using namespace cv;
using namespace std;
int main()
{
    // 读取图像
    Mat image = imread("image.jpg", IMREAD_COLOR);
    // 闭运算
    Mat kernel = getStructuringElement(MORPH_RECT, Size(5,5), Point(-1,-1));
    Mat closed;
    morphologyEx(image, closed, MORPH_CLOSE, kernel);
    // 显示结果
    imshow("Original Image", image);
    imshow("Closed Image", closed);
    waitKey(0);
    destroyAllWindows();
}
```

### 14.5 形态学梯度

形态学梯度运算是用图像的膨胀图像减腐蚀图像的操作，该操作可以获取原始图像中前景图像的边缘。

样例程序如下:

```cpp
#include <opencv2/opencv.hpp>
#include <iostream>
using namespace cv;
using namespace std;
int main()
{
    // 读取图像
    Mat image = imread("image.jpg", IMREAD_COLOR);
    // 形态学梯度
    Mat kernel = getStructuringElement(MORPH_RECT, Size(5,5), Point(-1,-1));
    Mat gradient;
    morphologyEx(image, gradient, MORPH_GRADIENT, kernel);
    // 显示结果
    imshow("Original Image", image);
    imshow("Gradient Image", gradient);
    waitKey(0);
    destroyAllWindows();
}
```

### 14.6 礼帽运算

礼帽运算是用原始图像减去其开运算图像的操作。礼帽运算能够获取图像的噪声信息，或者得到比原始图像的边缘更亮的边缘信息。

样例程序如下:

```cpp
#include <opencv2/opencv.hpp>
#include <iostream>
using namespace cv;
using namespace std;
int main()
{
    // 读取图像
    Mat image = imread("image.jpg", IMREAD_COLOR);
    // 礼帽运算
    Mat kernel = getStructuringElement(MORPH_RECT, Size(5,5), Point(-1,-1));
    Mat tophat;
    morphologyEx(image, tophat, MORPH_TOPHAT, kernel);
    // 显示结果
    imshow("Original Image", image);
    imshow("Tophat Image", tophat);
    waitKey(0);
    destroyAllWindows();
}
```

### 14.7 黑帽运算

黑帽运算是用闭运算图像减去原始图像的操作。黑帽运算能够获取图像内部的小孔，或前景色中的小黑点，或者得到比原始图像的边缘更暗的边缘部分。

样例程序如下:

```cpp
#include <opencv2/opencv.hpp>
#include <iostream>
using namespace cv;
using namespace std;
int main()
{
    // 读取图像
    Mat image = imread("image.jpg", IMREAD_COLOR);
    // 黑帽运算
    Mat kernel = getStructuringElement(MORPH_RECT, Size(5,5), Point(-1,-1));
    Mat blackhat;
    morphologyEx(image, blackhat, MORPH_BLACKHAT, kernel);
    // 显示结果
    imshow("Original Image", image);
    imshow("Blackhat Image", blackhat);
    waitKey(0);
    destroyAllWindows();
}
```

### 14.8 抽骨架

骨架化是指从一个二值图像中提取出形状的骨架部分。它通过迭代方法不断删除物体边缘的像素，直到只剩下一个像素宽度的骨架。

抽骨架的经典算法是：Zhang-Suen 算法。在opencv的improve模块中，提供了 `cv::ximgproc::thinning` 函数来实现 Zhang-Suen 算法。

样例程序如下:

```cpp
#include <opencv2/opencv.hpp>
#include <opencv2/ximgproc.hpp>
#include <iostream>
using namespace cv;
using namespace std;
int main()
{
    // 读取图像
    Mat image = imread("image.jpg", IMREAD_COLOR);
    // 骨架化
    Mat skeleton;
    ximgproc::thinning(image, skeleton, ximgproc::THINNING_ZHANGSUEN);
    // 显示结果
    imshow("Original Image", image);
    imshow("Skeleton Image", skeleton);
    waitKey(0);
    destroyAllWindows();
}
```

### 14.9 孔洞填充

孔洞填充是一种在图像处理中常用的技术，主要用于填充二值图像中的孔洞。孔洞是指由前景像素相连接的边界所包围的背景区域。

孔洞填充算法：迭代膨胀的方式与其原图的补集进行约束。孔洞填充公式: 第i层的结果为第i-1层的膨胀结果与原图的补集的交集。文字描述起来很抽象。

样例程序:

```cpp
#include <opencv2/opencv.hpp>
#include <iostream>
using namespace cv;
using namespace std;
int main()
{
    // 读取图像
    Mat image = imread("image.jpg", IMREAD_COLOR);
    // 灰度
    cvtColor(image, image, COLOR_BGR2GRAY);
    // 二值化
    Mat binary;
    threshold(image, binary, 100, 255, THRESH_BINARY);
    // 取原图的补集
    Mat complement;
    bitwise_not(binary, complement);
    // 构建膨胀核
    Mat kernel = getStructuringElement(MORPH_RECT, Size(3,3), Point(-1,-1));
    // 构建起始膨胀图像
    Mat marker = Mat::zeros(mask.size(), mask.type());
	marker.row(0) = 255;
	marker.row(marker.rows - 1) = 255;
	marker.col(0) = 255;
	marker.col(marker.cols - 1) = 255;
    Mat marker_pre, dilation, marker_temp;
    // 迭代膨胀
    while (1)
    {
        marker_pre = marker;
        dilate(marker, dilation, kernel);
        bitwise_and(dilation, complement, marker_temp);
        // cv::min(dilation, complement, marker_temp); // 由于二值化后的值只有0和255 所以,0 0则结果为0 255则结果为0 255 255则结果为255 与bitwise_and结果相同
        if (!countNonZero(marker != marker_temp)) break;
        else marker = maker_temp.clone();
    }
    cv::Mat res;
    bitwise_not(marker, res);
    imshow("Original Image", image);
    imshow("Filled Image", res);
    waitKey(0);
    destroyAllWindows();
}
```

### 14.10 分水岭分割





