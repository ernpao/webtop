#ifndef DISPLAY_H
#define DISPLAY_H

#include <Arduino.h>
#include <lvgl.h>
#include <TFT_eSPI.h>

TFT_eSPI tft = TFT_eSPI(); /* TFT instance */
static lv_disp_buf_t disp_buf;
static lv_color_t buf[LV_HOR_RES_MAX * 10];

/* Display flushing */
void _flush_cb(lv_disp_drv_t *disp, const lv_area_t *area, lv_color_t *color_p)
{
    uint32_t w = (area->x2 - area->x1 + 1);
    uint32_t h = (area->y2 - area->y1 + 1);

    tft.startWrite();
    tft.setAddrWindow(area->x1, area->y1, w, h);
    tft.pushColors(&color_p->full, w * h, true);
    tft.endWrite();

    lv_disp_flush_ready(disp);
}

/* Reading input device (simulated encoder here) */
bool _read_cb(lv_indev_drv_t *indev, lv_indev_data_t *data)
{
    static int32_t last_diff = 0;
    int32_t diff = 0;                   /* Dummy - no movement */
    int btn_state = LV_INDEV_STATE_REL; /* Dummy - no press */

    data->enc_diff = diff - last_diff;
    data->state = btn_state;

    last_diff = diff;

    return false;
}

void display_begin()
{
    lv_init();

    tft.begin();        /* TFT init */
    tft.setRotation(0); /* Landscape orientation */

    lv_disp_buf_init(&disp_buf, buf, NULL, LV_HOR_RES_MAX * 10);

    /*Initialize the display*/
    lv_disp_drv_t disp_drv;
    lv_disp_drv_init(&disp_drv);
    disp_drv.hor_res = 128;
    disp_drv.ver_res = 128;
    disp_drv.flush_cb = _flush_cb;
    disp_drv.buffer = &disp_buf;
    lv_disp_drv_register(&disp_drv);

    /*Initialize the (dummy) input device driver*/
    lv_indev_drv_t indev_drv;
    lv_indev_drv_init(&indev_drv);
    indev_drv.type = LV_INDEV_TYPE_ENCODER;
    indev_drv.read_cb = _read_cb;
    lv_indev_drv_register(&indev_drv);
}

void display_loop()
{
    lv_task_handler();
}

lv_obj_t *temperatureWidgetLabel;
float temperatureReading;

static void temperatureWidgetTask(lv_task_t *task)
{
    String tempStr = String(temperatureReading) + " C";
    // Serial.println("Updating Temperature Widget: " + tempStr);
    char buffer[8];
    tempStr.toCharArray(buffer, 8);
    lv_label_set_text(temperatureWidgetLabel, buffer);
    lv_task_ready(task);
}

static void temperatureWidgetBegin()
{
    display_begin();
    temperatureWidgetLabel = lv_label_create(lv_scr_act(), NULL);
    lv_obj_align(temperatureWidgetLabel, NULL, LV_ALIGN_CENTER, 0, 0);
    lv_task_t *task = lv_task_create(temperatureWidgetTask, 500, LV_TASK_PRIO_HIGHEST, &temperatureReading);
    lv_task_ready(task);
}

static void updateTemperatureWidget(float temperature)
{
    // Serial.println("Storing the temperature reading: " + String(temperature));
    temperatureReading = temperature;
    display_loop();
}

#endif